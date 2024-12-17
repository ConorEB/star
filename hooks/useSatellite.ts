import { useState, useEffect } from 'react';
import { calculateNextPass, predictSatellitePosition } from '@/lib/orbitPropagation';
import { DeviceLocation, MotionData } from '@/types/oritentation';
import { SatelliteData } from '@/types/satellite';

const initialSatelliteData: SatelliteData = {
    name: '',
    tle: { line1: '', line2: '' },
};

export function useSatellite(satelliteId: string) {
    const [satData, setSatData] = useState<SatelliteData>(initialSatelliteData);
    const [error, setError] = useState<string | null>(null);

    // Fetch TLE data from the API
    useEffect(() => {
        const fetchSatelliteData = async () => {
            if (!satelliteId) return;

            try {
                const response = await fetch(`/api/satellite/${satelliteId}`);
                if (!response.ok) setError('Failed to fetch satellite data.');

                const data = await response.json();
                const tleLines = data.tle.split('\r\n');
                if (tleLines.length !== 2 || !data.info.satname) {
                    setError('Invalid TLE data.');
                }

                setSatData({
                    name: data.info.satname,
                    tle: { line1: tleLines[0], line2: tleLines[1] }
                });
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchSatelliteData();
    }, []);

    return { satData, error };
}