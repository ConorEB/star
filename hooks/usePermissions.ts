import { useState, useEffect } from 'react';

export function usePermissions() {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Request permission for device sensors and fetch TLE data once
    const requestPermission = async () => {
        try {
            // Request permission if browser has the API
            if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
                const permission = await DeviceOrientationEvent.requestPermission();

                if (permission === 'granted') {
                    setPermissionGranted(true);
                } else {
                    setError('Permission for motion sensors was denied. Please allow access in browser settings to continue.');
                }
            } else {
                // For browsers that don't require explicit permissions
                window.addEventListener(
                    'deviceorientation',
                    (event) => {
                        if (event.alpha != null && event.beta != null && event.gamma != null) {
                            setPermissionGranted(true);
                        } else {
                            setError('Please use a mobile device to access this feature. This device does not support motion sensors. If using a mobile device, try a different browser!');
                        }
                    },
                    { once: true }
                );
            }
        } catch {
            setError('Failed to request permission for motion sensors. Refresh the page or try a different browser.');
        }
    };

    return { permissionGranted, requestPermission, error };
}