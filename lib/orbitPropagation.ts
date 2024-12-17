import * as satellite from 'satellite.js';

import { DeviceLocation } from '@/types/oritentation';
import { TLE } from '@/types/satellite';
import { radiansToDegrees } from './utils';

/**
 * Predicts the position of a satellite given its TLE (Two-Line Element) data and the observer's coordinates.
 *
 * @param {TLE} tle - The TLE data of the satellite, containing two lines of orbital elements. See more: https://en.wikipedia.org/wiki/Two-line_element_set
 * @param {DeviceLocation} observerCoords - The geographic coordinates of the observer, including longitude, latitude, and altitude.
 * @returns {Object} An object containing the azimuth and elevation angles of the satellite as seen from the observer's location.
 * @returns {number} azimuth - The azimuth angle in degrees.
 * @returns {number} elevation - The elevation angle in degrees.
 */
export const predictSatellitePosition = (
  tle: TLE,
  observerCoords: DeviceLocation,
) => {
  const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
  const positionAndVelocity = satellite.propagate(satrec, new Date());
  const positionEci = positionAndVelocity.position;

  const gmst = satellite.gstime(new Date());
  // @ts-expect-error ????
  const positionEcf = satellite.eciToEcf(positionEci, gmst);

  // Compute look angles (azimuth, elevation, range)
  const observerGd = {
    longitude: satellite.degreesToRadians(observerCoords.longitude),
    latitude: satellite.degreesToRadians(observerCoords.latitude),
    height: observerCoords.altitude / 1000, // Convert meters to kilometers
  };

  const lookAngles = satellite.ecfToLookAngles(
    observerGd,
    positionEcf,
  );

  return {
    azimuth: radiansToDegrees(lookAngles.azimuth),
    elevation: radiansToDegrees(lookAngles.elevation),
  };
};

/**
 * Calculates the next pass of a satellite given its TLE data and the observer's coordinates.
 * This is done by effectively looping through 48h of simulated time in 30-second intervals and find when the satellite has a relative elevation angle greater than 0 degrees.
 *
 * @param {TleData} tle - The TLE data of the satellite, containing two lines of orbital elements. See more: https://en.wikipedia.org/wiki/Two-line_element_set
 * @param {DeviceLocation} observerCoords - The geographic coordinates of the observer, including longitude, latitude, and altitude.
 * @returns {Date} The predicted date and time of the next pass of the satellite.
 */
export const calculateNextPass = (
  tle: TLE,
  observerCoords: DeviceLocation,
): Date => {
  let passTime = new Date(); // Directly using a Date object

  // Loop at 30 second intervals for 1 day (30 * 2880 = 24 hours)
  for (let timeAdjust = 0; timeAdjust < 10000; timeAdjust += 1) {
    // Calculate satellite's position and velocity at passTime
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
    const positionAndVelocity = satellite.propagate(satrec, passTime);

    const positionEci = positionAndVelocity.position;
    const gmst = satellite.gstime(passTime);
    // @ts-expect-error ???
    const positionEcf = satellite.eciToEcf(positionEci, gmst);

    // Compute look angles (azimuth, elevation, range)
    const observerGd = {
      longitude: satellite.degreesToRadians(observerCoords.longitude),
      latitude: satellite.degreesToRadians(observerCoords.latitude),
      height: observerCoords.altitude / 1000, // Convert meters to kilometers
    };

    const lookAngles = satellite.ecfToLookAngles(
      observerGd,
      positionEcf,
    );

    // If elevation angle is positive, the satellite is above the horizon
    if (lookAngles.elevation > 0) {
      return passTime;
    }

    // Increment 30 seconds per iteration
    passTime = new Date(passTime.getTime() + 30 * 1000);
  }

  return new Date();
};
