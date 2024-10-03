import * as satellite from 'satellite.js';

export const predictSatellitePosition = (tle1, tle2, date, observerCoords) => {
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
        };
    };