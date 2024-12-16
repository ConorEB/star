import * as satellite from 'satellite.js';
import { DeviceLocation } from '@/types/motionData';
import { TLE } from '@/types/satelliteData';
import { radiansToDegrees } from './utils';

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

  const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

  return {
    azimuth: radiansToDegrees(lookAngles.azimuth),
    elevation: radiansToDegrees(lookAngles.elevation),
  };
};

export const calculateNextPass = (
  tle: TleData,
  observerCoords: UserLocation,
): Date => {
  let passTime = new Date(); // Directly using a Date object

  // Loop at 30 second intervals for 1 day (30 * 2880 = 24 hours)
  for (let timeAdjust = 0; timeAdjust < 10000; timeAdjust++) {
    // Add 30 seconds per iteration
    passTime = new Date(passTime.getTime() + 30 * 1000);

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

    const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
    //alert(lookAngles.elevation)

    if (lookAngles.elevation > 0) {
      return passTime;
    }
  }

  return new Date();
};