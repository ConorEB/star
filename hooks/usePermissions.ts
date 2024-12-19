import { useState } from 'react';

/**
 * Hook to handle permissions for device sensors and fetch TLE data
 * NOTE: The web API for requesting permission is not supported in all browsers
 *
 * @returns {object} - An object containing permission state, error state, and function to request permission.
 *
 */
export function usePermissions() {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Request permission for device sensors and fetch TLE data once
    const requestPermission = async () => {
        try {
            // Request permission if browser has the API
            if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
                const permission = await (DeviceOrientationEvent as any).requestPermission();

                if (permission === 'granted') {
                    setPermissionGranted(true);
                } else {
                    setError('Permission for motion sensors was denied. Please allow access in browser settings to continue.');
                }
            }
            else {
                // For browsers that don't require explicit permissions (function doesn't exist in window)
                window.addEventListener(
                    'deviceorientation',
                    (event) => {
                        // Check if event contains all necessary data to determine if permission is granted
                        // BUG: Some browsers (non-mobile) send a false positive, so have to chck for null values
                        if (event.alpha != null && event.beta != null && event.gamma != null) {
                            setPermissionGranted(true);
                        } else {
                            setError('Please use a mobile device to access this feature. This device does not support motion sensors. If using a mobile device, try a different browser!');
                        }
                    },
                    { once: true } // Only listen for one event to check for permission, actual event listener is in useMotion.ts
                );
            }
        } catch {
            setError('Failed to request permission for motion sensors. Refresh the page or try a different browser.');
        }
    };

    return { permissionGranted, requestPermission, error };
}