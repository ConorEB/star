'use client';

import { useEffect, useState } from 'react';
import { handleDeviceOrientation } from '@/lib/motion';
import { predictSatellitePosition } from '@/lib/satellite';
import Pointer from '@/components/pointer';

export default function FindSatellite({ params }: { params: { id: string }}) {
    // Motion and location states
    const [tleData, setTleData] = useState(null);
    const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [location, setLocation] = useState({ latitude: 0, longitude: 0, altitude: 0 });
    const [heading, setHeading] = useState(0);

    // Permission states
    const [permissionRequested, setPermissionRequested] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Satellite data states
    const [satelliteName, setSatelliteName] = useState(null);
    const [satellitePosition, setSatellitePosition] = useState(null);
    const [azimuthDifference, setAzimuthDifference] = useState(0);
    const [elevationDifference, setElevationDifference] = useState(0);

    // Fetch TLE data from the API
    const fetchSatelliteData = async () => {
        const response = await fetch(`/api/satellite/${params.id}`);
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

            setAzimuthDifference(azDiff);
            setElevationDifference(elDiff);
        }
    }, [satellitePosition, heading, gyroData]);

    return (
        <div>
            {!permissionGranted ? (
                <button onClick={() => setPermissionRequested(true)}>Allow Sensor Access</button>
            ) : (
                <>
                    {/*}
          <div>
            <h2>Gyroscope Data:</h2>
            <p>Alpha: {gyroData.alpha.toFixed(2)}</p>
            <p>Beta: {gyroData.beta.toFixed(2)}</p>
            <p>Gamma: {gyroData.gamma.toFixed(2)}</p>
          </div>
          <div>
            <h2>GPS Location:</h2>
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
            <p>Altitude: {location.altitude.toFixed(2)} meters</p>
          </div>
          <div>
            <h2>Compass Heading (Azimuth):</h2>
            <p>Heading: {heading.toFixed(2)}°</p>
          </div>
          */}

                    {satellitePosition ? (
                        <>
                            <div>
                                <h2>Name: {satelliteName}</h2>
                                <h2>Predicted Satellite Position:</h2>
                                <p>Azimuth: {satellitePosition.azimuth.toFixed(2)}°</p>
                                <p>Elevation: {satellitePosition.elevation.toFixed(2)}°</p>
                            </div>

                            <div>
                                <h2>Align Your Device:</h2>
                                <p>Azimuth Difference: {azimuthDifference.toFixed(2)}°</p>
                                <p>Elevation Difference: {elevationDifference.toFixed(2)}°</p>
                                <Pointer azimuthDifference={azimuthDifference} elevationDifference={elevationDifference} />
                            </div>
                        </>
                    ) : (
                        <p>Loading satellite data... {satelliteName} {satellitePosition?.azimuth}</p>
                    )}
                </>
            )}
        </div>
    );
}