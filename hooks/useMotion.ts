import { MotionData } from '@/types/oritentation';
import { useState, useEffect } from 'react';

const initMotionData: MotionData = {
    location: { latitude: 0, longitude: 0, altitude: 0 },
    gyroscope: { alpha: 0, beta: 0, gamma: 0 },
    heading: 0,
}

/**
 * Hook to handle device oritnetation events and geolocation data and updating their state
 *
 * @param {boolean} motionPermissionGranted - Flag indicating if motion permission has been granted.
 * @returns {object} - An object containing motion data, error state, and functions to set error and manual location.
 *
 */
export function useMotion(motionPermissionGranted: boolean) {
    const [motionData, setMotionData] = useState<MotionData>(initMotionData);
    const [error, setError] = useState<string | null>(null);

    const setManualLocation = (latitude: number, longitude: number) => {
        setMotionData((prev) => ({
            ...prev,
            location: { latitude, longitude, altitude: 0 },
        }));
    };

    useEffect(() => {
        // Check if motion permission has been granted before continuing
        if (!motionPermissionGranted) return;

        // Receive device orientation event and update resulting motion data
        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            const { alpha, beta, gamma } = event;
            const webkitCompassHeading: number | null = (event as any).webkitCompassHeading; // webkitCompassHeading (true heading) is WebKit specific

            // Calculate heading
            let headingValue = webkitCompassHeading ?? (alpha ?? 0); // default to alpha value if webkitCompassHeading is not available
            if (window.screen.orientation && window.screen.orientation.angle) {
                headingValue += window.screen.orientation.angle;
            }
            headingValue = headingValue % 360;

            setMotionData((prev) => ({
                ...prev,
                heading: headingValue,
                gyroscope: { alpha: alpha ?? 0, beta: beta ?? 0, gamma: gamma ?? 0 },
            }));
        };

        // Fetch geolocation data with web API
        // NOTE: Has built in permission request API https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, altitude } = position.coords;
                    setMotionData((prev) => ({
                        ...prev,
                        location: { latitude, longitude, altitude: altitude ?? 0 }, // not all devices support altitude
                    }));
                },
                (error) => {
                    setError(error.message); // this will display UI to input location manually with lat/long
                },
                { timeout: 7000, enableHighAccuracy: true, maximumAge: 0 }
            );
        };

        fetchLocation();

        // Add event listener for device orientation/motion data
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [motionPermissionGranted]);

    return { motionData, error, setError, setManualLocation };
}