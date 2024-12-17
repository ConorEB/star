import { info } from "console";

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

export interface n2yoAPIResponse{
    info: {
        satid: number;
        satname: string;
        transactionscount: number;
    };
    tle: string;
}