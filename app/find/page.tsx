'use client';

import { Suspense, useEffect, useState } from 'react';
import { handleDeviceOrientation } from '@/lib/motion';
import { predictSatellitePosition } from '@/lib/satellite';
import Pointer from '@/components/pointer';

import { useSearchParams } from 'next/navigation'

interface TleData {
    line1: string;
    line2: string;
}

interface PredictedPosition {
    azimuth: number;
    elevation: number;
}

function FindSatellite() {
    const searchParams = useSearchParams();

    // Motion and location states
    const [tleData, setTleData] = useState<TleData>({
        line1: '',
        line2: '',
    });
    const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [location, setLocation] = useState({ latitude: 0, longitude: 0, altitude: 0 });
    const [heading, setHeading] = useState(0);

    // Permission states
    const [permissionRequested, setPermissionRequested] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Satellite data states
    const [satelliteName, setSatelliteName] = useState(null);
    const [satellitePosition, setSatellitePosition] = useState<PredictedPosition>({
        azimuth: 0,
        elevation: 0,
    });
    const [azimuthDifference, setAzimuthDifference] = useState(0);
    const [elevationDifference, setElevationDifference] = useState(0);

    // Fetch TLE data from the API
    const fetchSatelliteData = async () => {
        const satelliteId = searchParams.get('satelliteId')

        const response = await fetch(`/api/satellite/${satelliteId}`);
        if (response.ok) {
            const data = await response.json();
            setSatelliteName(data.info.satname);
            const tleLines = data.tle.split('\r\n'); // Split TLE into two lines
            setTleData({
                line1: tleLines[0],
                line2: tleLines[1],
            });
        } else {
            console.error('Failed to fetch TLE data');
        }
    };

    // Update satellite position from TLE data every second
    useEffect(() => {
        if (
            tleData?.line1 &&
            tleData?.line2 &&
            location.latitude !== 0 &&
            location.longitude !== 0
        ) {
            const intervalId = setInterval(() => {
                const predictedPosition = predictSatellitePosition(
                    tleData.line1,
                    tleData.line2,
                    new Date(),
                    location
                );

                setSatellitePosition(predictedPosition);
            }, 1000); // Update every second for smoother movement

            return () => clearInterval(intervalId);
        }
    }, [tleData, location]);

    // Request permission for device sensors and fetch TLE data once
    useEffect(() => {
        const requestPermission = async () => {
            if (
                typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function'
            ) {
                try {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if (permission === 'granted') {
                        setPermissionGranted(true);
                        fetchSatelliteData(); // Fetch TLE data once after permission is granted
                    }
                } catch (error) {
                    alert('Error requesting permission:', error);
                }
            } else {
                setPermissionGranted(true);
                fetchSatelliteData(); // Fetch TLE data directly if no permission is required
            }
        };

        requestPermission();
        // @ts-expect-error test
    }, [permissionRequested]);

    // Add event listeners for device sensors
    useEffect(() => {
        if (permissionGranted) {
            window.addEventListener('deviceorientation', (event) => handleDeviceOrientation(event, setGyroData, setHeading));
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude, altitude } = position.coords;
                setLocation({ latitude, longitude, altitude: altitude ?? 0 });
            });
        }

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [permissionGranted]);

    // Compute azimuth and elevation differences
    useEffect(() => {
        if (satellitePosition && heading !== null && gyroData.beta !== null) {
            // Compute azimuth difference
            let azDiff = satellitePosition.azimuth - heading;
            if (azDiff > 180) azDiff -= 360;
            if (azDiff < -180) azDiff += 360;

            // Compute elevation difference
            const deviceElevation = gyroData.beta - 90; // Beta is the tilt front-to-back & adjust for portrait mode
            const elDiff = satellitePosition.elevation - deviceElevation;

            setTimeout(() => {
                setAzimuthDifference(azDiff);
            }, 350);

            setTimeout(() => {
                setElevationDifference(elDiff);
            }, 200);
        }
    }, [satellitePosition, heading, gyroData]);

    return (
        <div>
            {!permissionGranted ? (
                <button onClick={() => setPermissionRequested(true)}>Allow Sensor Access</button>
            ) : (
                <>
                    {satellitePosition ? (
                        <div className='flex flex-row h-dvh justify-center items-center'>
                            <div>
                                <div>
                                    <p className='text-[20px] font-bold'>{satelliteName}</p>
                                    <p>Azimuth: {satellitePosition.azimuth.toFixed(2)}°</p>
                                    <p>Elevation: {satellitePosition.elevation.toFixed(2)}°</p>
                                    <p>Azimuth Difference: {azimuthDifference.toFixed(2)}°</p>
                                    <p>Elevation Difference: {elevationDifference.toFixed(2)}°</p>
                                </div>

                                <div className='flex items-center justify-center gap-10 mt-10'>
                                    <Pointer azimuthDifference={azimuthDifference} elevationDifference={elevationDifference} />

                                    <div className="flex flex-row items-center justify-center gap-4">
                                        <div className="border-2 border-dashed border-white/50 w-0 h-44 bg-transparent"></div>
                                        <div className='w-4 rounded-sm bg-gray-400 absolute h-[2px]'></div>
                                        <div
                                                className={`w-6 rounded-sm ${Math.abs(elevationDifference) < 20 ? 'bg-[#00ff73]' : 'bg-red-500'} absolute h-1`}
                                            style={{
                                                translate: `0px ${(elevationDifference / 2).toFixed(0)}px`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading satellite data... {satelliteName} {satellitePosition?.azimuth}</p>
                    )}
                </>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback="Loading">
            <FindSatellite />
        </Suspense>
    )
}