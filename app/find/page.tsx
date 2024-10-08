'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { handleDeviceOrientation } from '@/lib/motion';
import { calculateNextPass, predictSatellitePosition } from '@/lib/satellite';
import DirectionGuide from '@/components/direction-guide';

import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import Loader from '@/components/loader';

const initMotionData = {
    location: { latitude: 0, longitude: 0, altitude: 0 },
    gyroscope: { alpha: 0, beta: 0, gamma: 0 },
    heading: 0
};

const initSatData = {
    name: '',
    position: { azimuth: 0, elevation: 0 },
    nextPass: null,
    azimuthDifference: 0,
    elevationDifference: 0,
    tle: {
        line1: '',
        line2: ''
    }
};

const initConnectionData = {
    connected: false,
    message: 'Please redirect your antenna.'
}

function FindSatellite() {
    const searchParams = useSearchParams();

    // Motion and location states
    const [motionData, setMotionData] = useState<MotionData>(initMotionData);

    // Permission states
    const [permissionRequested, setPermissionRequested] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Satellite data states
    const [showData, setShowData] = useState(true);
    const [satData, setSatData] = useState<SatelliteData>(initSatData);

    // Connection state
    const [error, setError] = useState<null | string>(null);
    const [connectionData, setConnectionData] = useState<ConnectionData>(initConnectionData)

    // Fetch TLE data from the API
    const fetchSatelliteData = useCallback(async () => {
        const satelliteId = searchParams.get('satelliteId');

        const response = await fetch(`/api/satellite/${satelliteId}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            const tleLines = data.tle.split('\r\n'); // Split TLE into two lines

            if (tleLines.length !== 2) {
                setError('Failed to fetch satellite data. Make sure the NORAD ID: ' + satelliteId + ' is correct.');
                return;
            }

            setSatData((prevSatData: SatelliteData) => ({
                ...prevSatData,
                name: data.info.satname,
                tle: { line1: tleLines[0], line2: tleLines[1] },
            }));
        } else {
            setError('Failed to fetch satellite data. Make sure the NORAD ID: ' + satelliteId + ' is correct.');
        }
    }, [searchParams]);

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

                setSatData((prevSatData: SatelliteData) => ({
                    ...prevSatData,
                    position: predictedPosition,
                }));
            }, 1000); // Update every second for smoother movement

            // Calculate the next pass on initial load
            const nextPass = calculateNextPass(satData.tle, motionData.location);
            setSatData((prevSatData: SatelliteData) => ({
                ...prevSatData,
                nextPass,
            }));

            return () => clearInterval(intervalId);
        }
    }, [satData.tle, motionData.location]);

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
                } catch {
                    setError('Failed to request permission for motion sensors.');
                }
            } else {
                setError("Please use a mobile device to access this feature. This device does not support motion sensors.");
                //setPermissionGranted(true);
                //fetchSatelliteData(); // Fetch TLE data directly if no permission is required
            }
        };

        if (permissionRequested) requestPermission();
    }, [permissionRequested, fetchSatelliteData]);

    // Add event listeners for device sensors
    const handleDeviceOrientationEvent = (event: OrientationEvent) => handleDeviceOrientation(event, setMotionData);

    useEffect(() => {
        if (permissionGranted) {
            // @ts-expect-error I'll fix later
            window.addEventListener('deviceorientation', handleDeviceOrientationEvent);

            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude, altitude } = position.coords;

                // @ts-expect-error I'll fix this later
                setMotionData((prevMotionData) => ({
                    ...prevMotionData,
                    location: { latitude, longitude, altitude }
                }));
            }, () => {
                setError('Failed to get location data. Please enable location services for your web browser.');
            });
        }

        return () => {
            // @ts-expect-error I'll fix later
            window.removeEventListener('deviceorientation', handleDeviceOrientationEvent);
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
            const elDiff = satData.position.elevation - motionData.gyroscope.beta;

            setTimeout(() => {
                setSatData((prevSatData: SatelliteData) => ({
                    ...prevSatData,
                    azimuthDifference: azDiff,
                    elevationDifference: elDiff,
                }));
            }, 200);

            // Check if the user is pointing at the satellite
            if (Math.abs(azDiff) < 10 && Math.abs(elDiff) < 10) {
                setConnectionData({ connected: true, message: 'Keep pointing at satellite.' });
            } else if (satData.position.elevation < 0) {
                setConnectionData({ connected: false, message: 'Satellite is below the horizon, check next pass.' });
            } else {
                let message = 'Move antenna';
                const azThreshold = 15;
                const elThreshold = 15;

                const directions = [];

                // Determine azimuth adjustment
                if (azDiff > azThreshold) {
                    directions.push('to the right');
                } else if (azDiff < -azThreshold) {
                    directions.push('to the left');
                }

                // Determine elevation adjustment
                if (elDiff > elThreshold) {
                    directions.push('up');
                } else if (elDiff < -elThreshold) {
                    directions.push('down');
                }

                // Build the final message
                if (directions.length > 0) {
                    message += ' ' + directions.join(' and ') + '.';
                } else {
                    message = 'Antenna is aligned.';
                }

                setConnectionData({ connected: false, message });
            }
        }
    }, [satData.position, motionData.heading, motionData.gyroscope.beta]);

    // Show error screen
    if (error) {
        return (
            <div className='flex justify-center items-center h-dvh'>
                <div className='md:w-1/2 px-8'>
                    <p className='font-medium text-[25px]'>👎 There was an error.</p>
                    <p className='text-white/80 mt-2'>{error}</p>
                    <Link href={'/'} className='bg-blue-600 border-2 mt-4 border-white/50 w-40 py-2 font-medium flex items-center justify-center rounded-md cursor-pointer hover:translate-y-[-2px] duration-150'>Try Again</Link>
                </div>
            </div>
        )
    }

    // Show permission request UI if motion permission not allowed
    if (!permissionGranted) {
        return (
            <div className='flex justify-center items-center h-dvh px-8'>
                <div className='md:w-1/2'>
                    <p className='font-medium text-[25px]'>🚀 Device Motion & Location Needed</p>
                    <p className='text-white/80 mt-2'>{`I need to access your device's motion sensors like the gyroscope and location to be able to tell you where to point your phone (and antenna) at the satellite.`}</p>
                    <div
                        className='bg-blue-600 border-2 mt-4 border-white/50 w-40 py-2 font-medium flex items-center justify-center rounded-md cursor-pointer'
                        onClick={() => setPermissionRequested(true)}
                    >Allow access</div>

                    <p className='text-white/80 mt-6'>PS: After clicking the above button, your device will prompt you to confirm like the image below. Please press yes!</p>
                    <Image priority={true} src='/motion-request.jpeg' width={250} height={250} className='rounded-md border-2 mt-4 border-white/80' alt='Motion Permission' />
                </div>
            </div>
        )
    }

    // If still calculating satellite poisition data
    if (!satData.position || satData.position?.azimuth == 0) {
        return (
            <Loader />
        )
    }

    return (
        <div className='flex flex-row h-dvh justify-center items-center px-8'>
            <div>
                <div className='flex gap-4'>
                    <Link href={'/'} className='bg-gray-800 border-2 border-white/50 w-24 py-1 font-medium rounded-md flex items-center justify-center cursor-pointer hover:translate-y-[-2px] duration-150'>
                        ← Back
                    </Link>
                    <div className='bg-blue-600 border-2 border-white/50 w-32 py-1 font-medium flex items-center justify-center rounded-md cursor-pointer hover:translate-y-[-2px] duration-150'
                        onClick={() => setShowData(!showData)}
                    >
                        {showData ? 'Hide Data' : 'Show Data'}
                    </div>
                </div>

                <div className={`${showData ? 'block' : 'hidden'}`}>
                    <p className='text-[20px] font-semibold mt-6'>{satData.name}</p>
                    <div>Next Pass: {satData.nextPass ? satData.nextPass.toLocaleString([], { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Calculating...'}</div>
                    <p>Azimuth: {satData.position.azimuth.toFixed(2)}°</p>
                    <p>Elevation: {satData.position.elevation.toFixed(2)}°</p>
                    <p>Azimuth Difference: {satData.azimuthDifference.toFixed(1)}°</p>
                    <p>Elevation Difference: {satData.elevationDifference.toFixed(1)}°</p>


                    <div className='w-full h-[2px] bg-white/50 rounded-full mt-4' />
                </div>

                <div>
                    <p className={`${connectionData.connected ? 'text-[#00ff73]' : 'text-red-500'} mt-4 font-medium`}>{connectionData.connected ? 'CONNECTED' : 'LOST SIGNAL'}</p>
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