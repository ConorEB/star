'use client';

import { useEffect, useState } from 'react';
import * as satellite from 'satellite.js';

export default function Home() {
  const [tleData, setTleData] = useState(null);
  const [satellitePosition, setSatellitePosition] = useState(null);
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, altitude: 0 });
  const [heading, setHeading] = useState(0);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [azimuthDifference, setAzimuthDifference] = useState(0);
  const [elevationDifference, setElevationDifference] = useState(0);

  // Fetch TLE data from the API
  const fetchTleData = async () => {
    const response = await fetch(`/api/satellite`);
    if (response.ok) {
      const data = await response.json();
      const tleLines = data.tle.split('\r\n'); // Split TLE into two lines
      setTleData({
        line1: tleLines[0],
        line2: tleLines[1],
      });
      console.log("data fetched")
    } else {
      console.error('Failed to fetch TLE data');
    }
  };

  // Predict the satellite position using satellite.js
  const predictSatellitePosition = (tle1, tle2, date, observerCoords) => {
    console.log("predicting")
    const satrec = satellite.twoline2satrec(tle1, tle2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    const positionEci = positionAndVelocity.position;

    const gmst = satellite.gstime(date);
    const positionEcf = satellite.eciToEcf(positionEci, gmst);

    // Compute look angles (azimuth, elevation, range)
    const observerGd = {
      longitude: satellite.degreesToRadians(observerCoords.longitude),
      latitude: satellite.degreesToRadians(observerCoords.latitude),
      height: observerCoords.altitude / 1000, // Convert meters to kilometers
    };

    const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);


    return {
      azimuth: satellite.radiansToDegrees(lookAngles.azimuth),
      elevation: satellite.radiansToDegrees(lookAngles.elevation),
      range: lookAngles.rangeSat,
    };
  };

  // Update satellite position every second
  useEffect(() => {
    console.log("tleData", tleData)
    console.log("location", location)
    if (
      tleData &&
      tleData.line1 &&
      tleData.line2 &&
      location.latitude !== 0 &&
      location.longitude !== 0
    ) {
      const intervalId = setInterval(() => {
        const predictedPosition = predictSatellitePosition(
          tleData.line1,
          tleData.line2,
          new Date(),
          location // Pass the observer's location
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
            fetchTleData(); // Fetch TLE data once after permission is granted
          }
        } catch (error) {
          alert('Error requesting permission:', error);
        }
      } else {
        alert("hit else")
        setPermissionGranted(true);
        fetchTleData(); // Fetch TLE data directly if no permission is required
      }
    };

    requestPermission();
  }, [permissionRequested]);

  // Device orientation and motion handlers
  const handleDeviceOrientation = (event) => {
    const { alpha, beta, gamma, webkitCompassHeading } = event;

    // Calculate the device's heading (azimuth)
    let headingValue = webkitCompassHeading; // alpha is the compass heading in degrees

    // Handle device orientation (portrait vs. landscape)
    if (window.screen.orientation && window.screen.orientation.angle) {
      headingValue += window.screen.orientation.angle;
    }

    headingValue = headingValue % 360; // Ensure the heading is between 0 and 360

    setGyroData({
      alpha: alpha || 0,
      beta: beta || 0,
      gamma: gamma || 0,
    });

    setHeading(headingValue);
  };

  const handleDeviceMotion = (event) => {
    const { acceleration } = event;
    if (acceleration) {
      setAccelData({
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0,
      });
    }
  };

  const handleLocation = (position) => {
    const { latitude, longitude, altitude } = position.coords;
    setLocation({ latitude, longitude, altitude: altitude || 0 });
  };

  // Add event listeners for device sensors
  useEffect(() => {
    if (permissionGranted) { // @todo: check if permission is granted
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      window.addEventListener('devicemotion', handleDeviceMotion);
      navigator.geolocation.watchPosition(handleLocation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
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
      <h1>Satellite Tracker</h1>
      {!permissionGranted ? (
        <button onClick={() => setPermissionRequested(true)}>Allow Sensor Access</button>
      ) : (
        <>
          <div>
            <h2>Gyroscope Data:</h2>
            <p>Alpha: {gyroData.alpha.toFixed(2)}</p>
            <p>Beta: {gyroData.beta.toFixed(2)}</p>
            <p>Gamma: {gyroData.gamma.toFixed(2)}</p>
          </div>
          <div>
            <h2>Accelerometer Data:</h2>
            <p>X: {accelData.x.toFixed(2)}</p>
            <p>Y: {accelData.y.toFixed(2)}</p>
            <p>Z: {accelData.z.toFixed(2)}</p>
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

          {satellitePosition ? (
            <>
              <div>
                <h2>Predicted Satellite Position:</h2>
                <p>Azimuth: {satellitePosition.azimuth.toFixed(2)}°</p>
                <p>Elevation: {satellitePosition.elevation.toFixed(2)}°</p>
                <p>Range: {satellitePosition.range.toFixed(2)} km</p>
              </div>
              <div>
                <h2>Align Your Device:</h2>
                <div className="arrow-container">
                  <div
                    className="arrow"
                    style={{
                      transform: `rotate(${azimuthDifference}deg)`,
                      borderBottomColor: elevationDifference > 0 ? 'green' : 'red',
                    }}
                  />
                </div>
                <p>Azimuth Difference: {azimuthDifference.toFixed(2)}°</p>
                <p>Elevation Difference: {elevationDifference.toFixed(2)}°</p>
              </div>
            </>
          ) : (
            <p>Loading satellite data...</p>
          )}

          {/* Add the CSS styles */}
          <style jsx>{`
            .arrow-container {
              position: relative;
              width: 100px;
              height: 100px;
              margin: 20px auto;
            }

            .arrow {
              width: 0;
              height: 0;
              border-left: 50px solid transparent;
              border-right: 50px solid transparent;
              border-bottom: 100px solid red;
              position: absolute;
              top: 0;
              left: 0;
              transform-origin: 50% 100%; /* Rotate around the bottom center */
            }
          `}</style>
        </>
      )}
    </div>
  );
}