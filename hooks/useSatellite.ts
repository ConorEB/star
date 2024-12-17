import { useState, useEffect } from 'react';
import { SatelliteData } from '@/types/satellite';

const initialSatelliteData: SatelliteData = {
    name: '',
    tle: { line1: '', line2: '' },
};

/**
 * Hook to fetch satellite TLE data from the API
 *
 * @param {string} satelliteId - The NORAD satellite ID to fetch data for
 * @returns {object} - An object containing satellite data and error state.
 *
 */
export function useSatellite(satelliteId: string | null) {
    const [satData, setSatData] = useState<SatelliteData>(initialSatelliteData);
    const [error, setError] = useState<string | null>(null);

    // Fetch TLE data from the API
    useEffect(() => {
        const fetchSatelliteData = async () => {
            if (!satelliteId) {
                // If no satellite ID, set an error message and return earlu
                setError("No satellite ID provided. Try refreshing the page."); // NOTE: this should never happen unless a user modifies the URL
                return;
            }

            try {
                const response = await fetch(`/api/satellite/${satelliteId}`);
                if (!response.ok) setError('Failed to fetch satellite data.');

                // Parse response data and check for valid TLE data
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