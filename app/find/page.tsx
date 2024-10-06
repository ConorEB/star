'use client';

import { Suspense, useEffect, useState } from 'react';
import { handleDeviceOrientation } from '@/lib/motion';
import { calculateNextPass, predictSatellitePosition } from '@/lib/satellite';
import DirectionGuide from '@/components/direction-guide';

import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import Loader from '@/components/loader';

function FindSatellite() {
    const searchParams = useSearchParams();

    // Motion and location states
    const [motionData, setMotionData] = useState<MotionData>({
        location: { latitude: 0, longitude: 0, altitude: 0 },
        gyroscope: { alpha: 0, beta: 0, gamma: 0 },
        heading: 0
    });

    // Permission states
    const [permissionRequested, setPermissionRequested] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Satellite data states
    const [showData, setShowData] = useState(true);
    const [satData, setSatData] = useState<SatelliteData>({
        name: '',
        position: { azimuth: 0, elevation: 0 },
        nextPass: null,
        azimuthDifference: 0,
        elevationDifference: 0,
        tle: {
            line1: '',
            line2: ''
        }
    });

    // Connection state
    const [connectionData, setConnectionData] = useState<ConnectionData>({
        connected: true,
        message: 'Please redirect your antenna.'
    })

    // Fetch TLE data from the API
    const fetchSatelliteData = async () => {
        const satelliteId = searchParams.get('satelliteId')

        const response = await fetch(`/api/satellite/${satelliteId}`);
        if (response.ok) {
            const data = await response.json();
            const tleLines = data.tle.split('\r\n'); // Split TLE into two lines

            setSatData({
                name: data.info.satname,
                position: { azimuth: 0, elevation: 0 },
                tle: { line1: tleLines[0], line2: tleLines[1] },
                nextPass: null,
                azimuthDifference: 0,
                elevationDifference: 0,
            });
        } else {
            alert('Failed to fetch TLE data');
        }
    };

    // Update satellite position from TLE data every second
    useEffect(() => {
        if (
            satData.tle?.line1 &&
            motionData.location?.longitude !== 0
        ) {
            const intervalId = setInterval(() => {
                const predictedPosition = predictSatellitePosition(
                    satData.tle,
                    motionData.location
                );

                setSatData({
                    ...satData,
                    position: predictedPosition,
                });
            }, 1000); // Update every second for smoother movement

            // Calculate the next pass on initial load
            const nextPass = calculateNextPass(satData.tle, motionData.location);
            setSatData({ ...satData, nextPass });

            return () => clearInterval(intervalId);
        }
    }, [satData.tle?.line1, motionData.location?.longitude]);

    // Request permission for device sensors and fetch TLE data once
    useEffect(() => {
        const requestPermission = async () => {
            if (
                typeof DeviceOrientationEvent !== 'undefined' &&
                // @ts-expect-error It does exist
                typeof DeviceOrientationEvent.requestPermission === 'function'
            ) {
                try {
                    // @ts-expect-error It does exist
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if (permission === 'granted') {
                        setPermissionGranted(true);
                        fetchSatelliteData(); // Fetch TLE data once after permission is granted
                    }
                } catch (error) {
                    alert('Error requesting permission:' + error);
                }
            } else {
                //alert("no motion event available")
                setPermissionGranted(true);
                fetchSatelliteData(); // Fetch TLE data directly if no permission is required
            }
        };

        if (permissionRequested) requestPermission();
    }, [permissionRequested]);

    // Add event listeners for device sensors
    useEffect(() => {
        if (permissionGranted) {
            // @ts-expect-error Does not expect iOS heading value in type
            window.addEventListener('deviceorientation', (event) => handleDeviceOrientation(event, setMotionData));
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude, altitude } = position.coords;
                setMotionData({
                    ...motionData,
                    // @ts-expect-error I'll fix this later
                    location: { latitude, longitude, altitude }
                });
            });
        }

        return () => {
            // @ts-expect-error No overload matches this call
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [permissionGranted]);

    // Compute azimuth and elevation differences, calc connection status
    useEffect(() => {
        if (satData.position && motionData.heading !== null && motionData.gyroscope.beta !== null) {
            // Compute azimuth difference
            let azDiff = satData.position.azimuth - motionData.heading;
            if (azDiff > 180) azDiff -= 360;
            if (azDiff < -180) azDiff += 360;

            // Compute elevation difference
            const deviceElevation = motionData.gyroscope.beta;
            const elDiff = satData.position.elevation - deviceElevation;

            setTimeout(() => {
                setSatData({
                    ...satData,
                    azimuthDifference: azDiff,
                });
            }, 350);

            setTimeout(() => {
                setSatData({
                    ...satData,
                    elevationDifference: elDiff,
                });
            }, 200);

            // Check if the user is pointing at the satellite
            if (Math.abs(azDiff) < 5 && Math.abs(elDiff) < 5) {
                setConnectionData({ connected: true, message: 'Connected' });
            } else {
                setConnectionData({ connected: false, message: 'Not Connected' });
            }
        }
    }, [satData.position, motionData.heading, motionData.gyroscope]);

    // Show permission request UI if motion permission not allowed
    if (!permissionGranted) {
        return (
            <div className='flex justify-center items-center h-dvh px-8'>
                <div className='md:w-1/2'>
                    <p className='font-semibold text-[30px]'>🚀 Device Motion Needed</p>
                    <p className='text-white/80 mt-2'>{`I need to access your device's motion sensors like the gyroscope to be able to tell you where to point your phone (and antenna) at the satellite.`}</p>
                    <div
                        className='bg-blue-600 border-2 mt-4 border-white/50 w-48 py-2 font-medium flex items-center justify-center rounded-md cursor-pointer'
                        onClick={() => setPermissionRequested(true)}
                    >Allow motion access</div>

                    <p className='text-white/80 mt-6'>PS: After clicking the above button, your device will prompt you to confirm like the image below. Please press yes!</p>
                    <Image src='/motion-permission.png' width={250} height={250} className='rounded-md border-2 mt-4 border-white/80' alt='Motion Permission' />
                </div>
            </div>
        )
    }

    // If still calculating satellite poisition data
    if (!satData.position) {
        return (
            <div className='flex justify-center items-center h-dvh px-8'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='flex flex-row h-dvh justify-center items-center px-8'>
            <div>
                <div className='flex gap-4'>
                    <Link href={'/'} className='bg-gray-800 border-2 border-white/50 w-24 py-1 font-medium rounded-md flex items-center justify-center cursor-pointer'>
                        ← Back
                    </Link>
                    <div className='bg-blue-600 border-2 border-white/50 w-32 py-1 font-medium flex items-center justify-center rounded-md cursor-pointer'
                        onClick={() => setShowData(!showData)}
                    >
                        {showData ? 'Hide Data' : 'Show Data'}
                    </div>
                </div>

                <div className={`${showData ? 'block' : 'hidden'}`}>
                    <p className='text-[20px] font-semibold mt-6'>{satData.name}</p>
                    <div>Next Pass: {satData.nextPass?.toLocaleString() || 'Calculating...'}</div>
                    <p>Azimuth: {satData.position.azimuth.toFixed(2)}°</p>
                    <p>Elevation: {satData.position.elevation.toFixed(2)}°</p>
                    <p>Azimuth Difference: {satData.azimuthDifference.toFixed(2)}°</p>
                    <p>Elevation Difference: {satData.elevationDifference.toFixed(2)}°</p>

                    <div className='w-full h-[2px] bg-white/50 rounded-full mt-4' />
                </div>

                <div>
                    <p className={`${connectionData.connected ? 'text-[#00ff73]' : 'text-red-500'} mt-4 font-semibold`}>{connectionData.connected ? 'CONNECTED' : 'LOST SIGNAL'}</p>
                    <p className='pt-1'>{connectionData.message}</p>
                </div>

                <div className='flex items-center justify-center gap-10 mt-12'>
                    <DirectionGuide satData={satData} />
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loader />}>
            <FindSatellite />
        </Suspense>
    )
}