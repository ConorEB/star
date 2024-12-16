/**
 * Represents the Two-Line Element (TLE) data for a satellite.
 * 
 * @property {string} line1 - The first line of the TLE data.
 * @property {string} line2 - The second line of the TLE data.
 */
interface TleData {
    line1: string;
    line2: string;
}

/**
 * Represents the position of a satellite.
 * 
 * @property {number} azimuth - The azimuth angle of the satellite.
 * @property {number} elevation - The elevation angle of the satellite.
 */
interface SatellitePosiiton {
    azimuth: number;
    elevation: number;
}

/**
 * Represents the data for a satellite.
 * 
 * @property {string} name - The name of the satellite.
 * @property {SatellitePosiiton | null} position - The current position of the satellite, or null if not available.
 * @property {TleData} tle - The Two-Line Element data for the satellite.
 * @property {Date | null} nextPass - The date and time of the next pass of the satellite, or null if not available.
 * @property {number} azimuthDifference - The difference in azimuth angle since the last update.
 * @property {number} elevationDifference - The difference in elevation angle since the last update.
 */
interface SatelliteData {
    name: string;
    position: SatellitePosiiton | null;
    tle: TleData;
    nextPass: Date | null;
    azimuthDifference: number;
    elevationDifference: number;
}

/**
 * Represents the location of a user.
 * 
 * @property {number} latitude - The latitude of the user's location.
 * @property {number} longitude - The longitude of the user's location.
 * @property {number} altitude - The altitude of the user's location.
 */
interface UserLocation {
    latitude: number;
    longitude: number;
    altitude: number;
}

/**
 * Represents motion data from a device.
 * 
 * @property {Object} gyroscope - The gyroscope data.
 * @property {number} gyroscope.alpha - The alpha angle from the gyroscope.
 * @property {number} gyroscope.beta - The beta angle from the gyroscope.
 * @property {number} gyroscope.gamma - The gamma angle from the gyroscope.
 * @property {number} heading - The heading direction of the device.
 * @property {UserLocation} location - The location data of the user.
 */
interface MotionData {
    gyroscope: { alpha: number; beta: number; gamma: number };
    heading: number;
    location: UserLocation;
}

/**
 * Represents the connection status.
 * 
 * @property {boolean} connected - Indicates whether the connection is established.
 * @property {string} message - A message describing the connection status.
 */
interface ConnectionData {
    connected: boolean;
    message: string;
}

/**
 * Represents an orientation event.
 * 
 * @property {number} alpha - The alpha angle of the orientation event.
 * @property {number} beta - The beta angle of the orientation event.
 * @property {number} gamma - The gamma angle of the orientation event.
 * @property {number} webkitCompassHeading - The compass heading from the WebKit browser.
 */
interface OrientationEvent {
    alpha: number;
    beta: number;
    gamma: number;
    webkitCompassHeading: number;
}