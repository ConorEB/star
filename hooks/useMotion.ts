import { MotionData } from '@/types/oritentation';
import { useState, useEffect } from 'react';

export function useMotion(permissionGranted: boolean) {
    const [motionData, setMotionData] = useState<MotionData>({
        location: { latitude: 0, longitude: 0, altitude: 0 },
        gyroscope: { alpha: null, beta: null, gamma: null },
        heading: 0,
    });
    const [error, setError] = useState<string | null>(null);

    const setManualLocation = (latitude, longitude) => {
        setMotionData((prev) => ({
            ...prev,
            location: { latitude, longitude, altitude: 0 },
        }));
    };

    useEffect(() => {
        if (!permissionGranted) return;

        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            const { alpha, beta, gamma, webkitCompassHeading } = event;

            // Calculate heading
            let headingValue = webkitCompassHeading ?? (alpha ?? 0);
            if (window.screen.orientation && window.screen.orientation.angle) {
                headingValue += window.screen.orientation.angle;
            }
            headingValue = headingValue % 360;

            setMotionData((prev) => ({
                ...prev,
                heading: headingValue,
                gyroscope: { alpha: alpha ?? null, beta: beta ?? null, gamma: gamma ?? null },
            }));
        };

        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, altitude } = position.coords;
                    setMotionData((prev) => ({
                        ...prev,
                        location: { latitude, longitude, altitude: altitude ?? 0 },
                    }));
                },
                (error) => {
                    setLocationError(error.message);
                },
                { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
            );
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation);
        fetchLocation();

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [permissionGranted]);

    return { motionData, error, setMotionData };
}