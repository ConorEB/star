import { calculateNextPass, predictSatellitePosition } from "@/lib/orbitPropagation";
import { MotionData, TrackingStatus } from "@/types/oritentation";
import { SatelliteData } from "@/types/satellite";
import { useEffect, useState } from "react";

const initTrackingStatus: TrackingStatus = {
    azimuthDifference: 0,
    elevationDifference: 0,
    nextPass: null,
    connected: false,
    message: 'Please redirect your antenna.',
};

const initSatellitePosition: SatellitePosition = {
    azimuth: 0,
    elevation: 0,
};

export function useTracking(motionData: MotionData, satData: SatelliteData) {
    const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>(initTrackingStatus);
    const [satPosition, setSatPosition] = useState<SatellitePosition>(initSatellitePosition);

    // Calculate azimuth/elevation differenced
    useEffect(() => {
        if (satPosition && motionData.heading && motionData.gyroscope.beta) {
            let azDiff = satPosition.azimuth - motionData.heading;
            if (azDiff > 180) azDiff -= 360;
            if (azDiff < -180) azDiff += 360;

            const elDiff = satPosition.elevation - (motionData.gyroscope.beta ?? 0);

            setTimeout(() => {
                setTrackingStatus((prev) => ({
                    ...prev,
                    azimuthDifference: azDiff,
                    elevationDifference: elDiff,
                }));
            }, 200); // delay to prevent bug for server side rendered components, need to investigate further
        }
    }, [satPosition, motionData.heading, motionData.gyroscope.beta]);

    // Update connection status message
    useEffect(() => {
        const azDiff = trackingStatus.azimuthDifference;
        const elDiff = trackingStatus.elevationDifference;

        if (Math.abs(azDiff) < 10 && Math.abs(elDiff) < 10) {
            setTrackingStatus((prev) => ({
                ...prev,
                connected: true,
                message: 'Keep pointing at satellite.',
            }));
        } else if (satPosition.elevation < 0) {
            setTrackingStatus((prev) => ({
                ...prev,
                connected: false,
                message: 'Satellite is below the horizon, check next pass.',
            }));
        } else {
            // Generate device orientation message based on current azimuth/elevation differences
            let message = 'Move antenna'; // base message
            const directions: string[] = [];

            if (azDiff > 15) directions.push('to the right');
            else if (azDiff < -15) directions.push('to the left');

            if (elDiff > 15) directions.push('up');
            else if (elDiff < -15) directions.push('down');

            if (directions.length > 0) {
                message += ' ' + directions.join(' and ') + '.';
            } else {
                message = 'Antenna is aligned.';
            }

            setTrackingStatus((prev) => ({
                ...prev,
                connected: false,
                message,
            }));
        }
    }, [trackingStatus.azimuthDifference, trackingStatus.elevationDifference, satPosition.elevation]);

    // Update satellite position from TLE data every second
    useEffect(() => {
        const location: DeviceLocation = motionData.location;

        if (satData.tle.line1 && location.longitude !== 0) {
            const intervalId = setInterval(() => {
                const predictedPosition = predictSatellitePosition(satData.tle, location);
                setSatPosition(predictedPosition);
            }, 1000);

            const nextPass = calculateNextPass(satData.tle, location);
            setTrackingStatus((prev) => ({ ...prev, nextPass }));

            return () => clearInterval(intervalId);
        }
    }, [satData.tle, motionData.location]);

    return { trackingStatus, satPosition };
}