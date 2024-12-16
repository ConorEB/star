import { ConnectionData } from "@/types/connectionData";
import { MotionData } from "@/types/motionData";
import { SatelliteData } from "@/types/satelliteData";
import { useEffect, useState } from "react";

const initConnectionData: ConnectionData = {
    connected: false,
    message: 'Please redirect your antenna.',
};

export function useConnection(motionData: MotionData, satData: SatelliteData, setSatData) {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionData>(initConnectionData);

    // Compute azimuth/elevation differences & connection status
    useEffect(() => {
        if (satData.position && motionData.heading && motionData.gyroscope.beta) {
            let azDiff = satData.position.azimuth - motionData.heading;
            if (azDiff > 180) azDiff -= 360;
            if (azDiff < -180) azDiff += 360;

            const elDiff = satData.position.elevation - (motionData.gyroscope.beta ?? 0);

            setTimeout(() => {
                setSatData((prevSat: SatelliteData) => ({
                    ...prevSat,
                    azimuthDifference: azDiff,
                    elevationDifference: elDiff,
                }));
            }, 200); // delay to prevent bug for server side rendered components, need to investigate further

            if (Math.abs(azDiff) < 10 && Math.abs(elDiff) < 10) {
                setConnectionStatus({ connected: true, message: 'Keep pointing at satellite.' });
            } else if (satData.position.elevation < 0) {
                setConnectionStatus({ connected: false, message: 'Satellite is below the horizon, check next pass.' });
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

                setConnectionStatus({ connected: false, message });
            }
        }
    }, [satData.position, motionData.heading, motionData.gyroscope.beta]);

    return { connectionStatus };
}