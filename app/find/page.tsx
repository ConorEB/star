'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import DirectionGuide from '@/components/direction-guide';
import Input from '@/components/input';
import Loader from '@/components/loader';
import { calculateNextPass, predictSatellitePosition } from '@/lib/satellite';

const initMotionData = {
  location: { latitude: 0, longitude: 0, altitude: 0 },
  gyroscope: { alpha: 0, beta: 0, gamma: 0 },
  heading: 0,
};

const initSatData = {
  name: '',
  position: { azimuth: 0, elevation: 0 },
  nextPass: null,
  azimuthDifference: 0,
  elevationDifference: 0,
  tle: {
    line1: '',
    line2: '',
  },
};

const initConnectionData = {
  connected: false,
  message: 'Please redirect your antenna.',
};

function FindSatellite() {
  const searchParams = useSearchParams();

  // Motion and location states
  const [motionData, setMotionData] = useState<MotionData>(initMotionData);
  const [manualLongitude, setManualLongitude] = useState<string | undefined>();
  const [manualLatitude, setManualLatitude] = useState<string | undefined>();
  const [locationError, setLocationError] = useState<string | null>(null);

  // Connection state
  const [error, setError] = useState<null | string>(null);
  const [connectionData, setConnectionData] =
    useState<ConnectionData>(initConnectionData);

  // Permission states
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const permissionRef = useRef(permissionGranted);
  const errorRef = useRef(error);

  // Satellite data states
  const [showData, setShowData] = useState(true);
  const [satData, setSatData] = useState<SatelliteData>(initSatData);

  // Fetch TLE data from the API
  const fetchSatelliteData = useCallback(async () => {
    const satelliteId = searchParams.get('satelliteId');

    const response = await fetch(`/api/satellite/${satelliteId}`);
    if (response.ok) {
      const data = await response.json();
      const tleLines = data.tle.split('\r\n'); // Split TLE into two lines

      if (tleLines.length !== 2 || !data.info.satname) {
        setError(
          'Failed to fetch satellite data. Make sure the NORAD ID: ' +
            satelliteId +
            ' is correct.',
        );
        return;
      }

      setSatData((prevSatData: SatelliteData) => ({
        ...prevSatData,
        name: data.info.satname,
        tle: { line1: tleLines[0], line2: tleLines[1] },
      }));
    } else {
      setError(
        'Failed to fetch satellite data. Make sure the NORAD ID: ' +
          satelliteId +
          ' is correct.',
      );
    }
  }, [searchParams]);

  // Device orientation and motion handlers
  // @ts-expect-error setMotionData is a function
  const handleDeviceOrientation = (
    event: OrientationEvent,
    setMotionData,
  ) => {
    const { alpha, beta, gamma, webkitCompassHeading } = event;

    // Calculate the device's heading (azimuth)
    let headingValue = webkitCompassHeading; // alpha is the compass heading in degrees

    // Handle device orientation (portrait vs. landscape)
    if (window.screen.orientation && window.screen.orientation.angle) {
      headingValue += window.screen.orientation.angle;
    }

    headingValue = headingValue % 360; // Ensure the heading is between 0 and 360

    setMotionData((prevData: MotionData) => ({
      ...prevData,
      heading: headingValue || beta,
      gyroscope: { alpha, beta, gamma },
    }));
  };

  // Update satellite position from TLE data every second
  useEffect(() => {
    if (satData.tle?.line1 && motionData.location?.longitude !== 0) {
      const intervalId = setInterval(() => {
        const predictedPosition = predictSatellitePosition(
          satData.tle,
          motionData.location,
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

  useEffect(() => {
    permissionRef.current = permissionGranted;
    errorRef.current = error;
  }, [permissionGranted, error]);

  // Request permission for device sensors and fetch TLE data once
  useEffect(() => {
    const requestPermission = async () => {
      // @ts-expect-error It does exist
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        // @ts-expect-error It does exist
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          fetchSatelliteData(); // Fetch TLE data once after permission is granted
        } else if (permission === 'denied') {
          setError(
            'Permission for motion sensors was denied. Please allow access in browser settings to continue.',
          );
        } else {
          setError('Failed to request permission for motion sensors.');
        }
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        window.addEventListener(
          'deviceorientation',
          (event) => {
            if (
              event.alpha != null &&
              event.beta != null &&
              event.gamma != null
            ) {
              setPermissionGranted(true);
              fetchSatelliteData(); // Fetch TLE data once after permission is granted
            } else {
              setError(
                'Please use a mobile device to access this feature. This device does not support motion sensors. If using a mobile device, try a different browser!',
              );
            }
          },
          { once: true },
        );
      } else {
        setError(
          'Please use a mobile device to access this feature. This device does not support motion sensors. If using a mobile device, try a different browser!',
        );
      }
    };

    const permissionFlow = async () => {
      // Run request permission function to try and get data
      try {
        await requestPermission();

        // Wait 1 second after permission request to check if data is available
        setTimeout(() => {
          if (!permissionRef.current && !errorRef.current) {
            setError(
              'Please use a mobile device to access this feature. This device does not support motion sensors. If using a mobile device, try a different browser!',
            );
          }
        }, 1000);
      } catch {
        setError(
          'Failed to request permission for motion sensors. Refresh the page or try a different browser.',
        );
      }
    };

    if (permissionRequested) {
      permissionFlow();
    }
  }, [permissionRequested, fetchSatelliteData]);

  // Add event listeners for device sensors
  const handleDeviceOrientationEvent = (event: OrientationEvent) =>
    handleDeviceOrientation(event, setMotionData);

  useEffect(() => {
    if (permissionGranted) {
      // @ts-expect-error I'll fix later
      window.addEventListener(
        'deviceorientation',
        handleDeviceOrientationEvent,
      );

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, altitude } = position.coords;

          // @ts-expect-error I'll fix this later
          setMotionData((prevMotionData) => ({
            ...prevMotionData,
            location: { latitude, longitude, altitude },
          }));
        },
        (error) => {
          setLocationError(error.message);
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 },
      );
    }

    return () => {
      // @ts-expect-error I'll fix later
      window.removeEventListener(
        'deviceorientation',
        handleDeviceOrientationEvent,
      );
    };
  }, [permissionGranted]);

  // Compute azimuth and elevation differences, calc connection status
  useEffect(() => {
    if (
      satData.position &&
      motionData.heading !== null &&
      motionData.gyroscope.beta !== null
    ) {
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
        setConnectionData({
          connected: true,
          message: 'Keep pointing at satellite.',
        });
      } else if (satData.position.elevation < 0) {
        setConnectionData({
          connected: false,
          message: 'Satellite is below the horizon, check next pass.',
        });
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
      <div className="flex h-dvh items-center justify-center">
        <div className="px-8 md:w-1/2">
          <p className="text-[25px] font-medium">👎 There was an error.</p>
          <p className="mt-2 text-white/80">{error}</p>
          <Link
            href={'/'}
            className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-blue-600 py-2 font-medium duration-150 hover:translate-y-[-2px]"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  // Show permission request UI if motion permission not allowed
  if (!permissionGranted) {
    return (
      <div className="flex h-dvh items-center justify-center px-8">
        <div className="md:w-1/2">
          <p className="text-[25px] font-medium">
            🚀 Device Motion & Location Needed
          </p>
          <p className="mt-2 text-white/80">{`I need to access your device's motion sensors like the gyroscope and location to be able to tell you where to point your phone (and antenna) at the satellite.`}</p>
          <div
            className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-blue-600 py-2 font-medium duration-150 hover:translate-y-[-2px]"
            onClick={() => setPermissionRequested(true)}
          >
            Continue
          </div>

          <p className="mt-6 text-white/80">
            PS: After clicking the above button, your device will prompt you to
            confirm like the image below. Please press yes!
          </p>
          <Image
            priority={true}
            src="/images/motion-request.png"
            width={250}
            height={250}
            className="mt-4 rounded-md border-2 border-white/80"
            alt="Motion Permission"
          />
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex h-dvh items-center justify-center px-8">
        <div className="md:w-1/2">
          <p className="text-[25px] font-medium">
            🌎 Error accessing device location.
          </p>
          <p className="mt-2 text-white/80">{`Please check that location permissions are enabled for this browser's settings. Otherwise manually input latitude & longitude values (reminder to include a negative sign if needed). Error: ${locationError}`}</p>
          <Input
            placeholder="Enter Latitude"
            inputMode="text"
            onChange={(e) => setManualLatitude(e.target.value)}
          />

          <Input
            placeholder="Enter Longitude"
            inputMode="text"
            onChange={(e) => setManualLongitude(e.target.value)}
          />

          <div
            className="mt-4 flex w-40 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-[#1fa95d] py-2 font-medium"
            onClick={() => {
              setMotionData((prevMotionData) => ({
                ...prevMotionData,
                location: {
                  latitude: parseFloat(manualLatitude || '0'),
                  longitude: parseFloat(manualLongitude || '0'),
                  altitude: 0,
                },
              }));

              setLocationError(null);
            }}
          >
            Submit location
          </div>
        </div>
      </div>
    );
  }

  // If still calculating satellite poisition data
  if (!satData.position || satData.position?.azimuth == 0) {
    return <Loader />;
  }

  return (
    <div className="flex h-dvh flex-row items-center justify-center px-8">
      <div>
        <div className="flex gap-4">
          <Link
            href={'/'}
            className="flex w-24 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-gray-800 py-1 font-medium duration-150 hover:translate-y-[-2px]"
          >
            ← Back
          </Link>
          <div
            className="flex w-32 cursor-pointer items-center justify-center rounded-md border-2 border-white/50 bg-blue-600 py-1 font-medium duration-150 hover:translate-y-[-2px]"
            onClick={() => setShowData(!showData)}
          >
            {showData ? 'Hide Data' : 'Show Data'}
          </div>
        </div>

        <div className={`${showData ? 'block' : 'hidden'}`}>
          <p className="mt-6 text-[20px] font-semibold">{satData.name}</p>
          <div>
            Next Pass:{' '}
            {satData.nextPass
              ? satData.nextPass.toLocaleString([], {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Calculating...'}
          </div>
          <p>Azimuth: {satData.position.azimuth.toFixed(2)}°</p>
          <p>Elevation: {satData.position.elevation.toFixed(2)}°</p>
          <p>Azimuth Difference: {satData.azimuthDifference.toFixed(1)}°</p>
          <p>Elevation Difference: {satData.elevationDifference.toFixed(1)}°</p>

          <div className="mt-4 h-[2px] w-full rounded-full bg-white/50" />
        </div>

        <div>
          <p
            className={`${connectionData.connected ? 'text-[#00ff73]' : 'text-red-500'} mt-4 font-medium`}
          >
            {connectionData.connected ? 'CONNECTED' : 'LOST SIGNAL'}
          </p>
          <p className="pt-1">{connectionData.message}</p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-10">
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
  );
}
