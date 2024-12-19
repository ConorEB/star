
/**
 * Represents a Two-Line Element set (TLE) which is used to describe the orbit of a satellite.
 * @see https://en.wikipedia.org/wiki/Two-line_element_set
 */
export interface TLE {
    line1: string; // first line of TLE
    line2: string; // second line of TLE
}

/**
 * Represents the position of a satellite in terms of azimuth and elevation.
 */
export interface SatellitePosition {
    azimuth: number; // angle in degrees clockwise from true north
    elevation: number; // angle in degrees above the horizon
}

/**
 * Represents the data related to a satellite, including its name and TLE information.
 */
export interface SatelliteData {
    name: string; // name of the satellite
    tle: TLE | null;
}

/**
 * Represents the response from the N2YO API, including satellite information and TLE data.
 * @see https://www.n2yo.com/api/
 */
export interface N2YOAPIResponse {
    info: {
        satid: number; // NORAD ID of the satellite
        satname: string; // name of the satellite
        transactionscount: number; // number of API transactions
    };
    tle: string; // single line string containing TLE data
}