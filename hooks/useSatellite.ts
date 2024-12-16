import { useState, useEffect, useCallback } from 'react';
import { calculateNextPass, predictSatellitePosition } from '@/lib/orbitPropagation';
import { DeviceLocation, MotionData } from '@/types/motionData';
import { SatelliteData } from '@/types/satelliteData';

const initialSatelliteData: SatelliteData = {
    name: '',
    position: null,
    nextPass: null,
    azimuthDifference: 0,
    elevationDifference: 0,
    tle: { line1: '', line2: '' },
};

export function useSatellite(satelliteId: string | null, motionData: MotionData) {
    const [satData, setSatData] = useState<SatelliteData>(initialSatelliteData);
    const [error, setError] = useState<string | null>(null);

    const location: DeviceLocation = motionData.location;

    // Fetch TLE data from the API
    const fetchSatelliteData = useCallback(async () => {
        if (!satelliteId) return;

        try {
            const response = await fetch(`/api/satellite/${satelliteId}`);
            if (!response.ok) throw new Error('Failed to fetch satellite data.');

            const data = await response.json();
            const tleLines = data.tle.split('\r\n');
            if (tleLines.length !== 2 || !data.info.satname) {
                throw new Error('Invalid TLE data.');
            }

            setSatData((prev) => ({
                ...prev,
                name: data.info.satname,
                tle: { line1: tleLines[0], line2: tleLines[1] },
            }));
        } catch (err: any) {
            setError(err.message);
        }
    }, [satelliteId]);

    // Update satellite position from TLE data every second
    useEffect(() => {
        if (satData.tle.line1 && location.longitude !== 0) {
            const intervalId = setInterval(() => {
                const predictedPosition = predictSatellitePosition(satData.tle, location);
                setSatData((prev) => ({ ...prev, position: predictedPosition }));
            }, 1000);

            const nextPass = calculateNextPass(satData.tle, location);
            setSatData((prev) => ({ ...prev, nextPass }));

            return () => clearInterval(intervalId);
        }
    }, [satData.tle, location]);

    return { satData, setSatData, error, fetchSatelliteData };
}