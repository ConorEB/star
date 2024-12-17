export interface TLE {
    line1: string;
    line2: string;
}

export interface SatellitePosition {
    azimuth: number;
    elevation: number;
}

export interface SatelliteData {
    name: string;
    tle: TLE | null;
}