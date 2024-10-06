interface TleData {
    line1: string;
    line2: string;
}

interface SatellitePosiiton {
    azimuth: number;
    elevation: number;
}

interface SatelliteData {
    name: string;
    position: SatellitePosiiton | null;
    tle: TleData;
    nextPass: Date | null;
    azimuthDifference: number;
    elevationDifference: number;
}

interface UserLocation {
    latitude: number;
    longitude: number;
    altitude: number;
}

interface MotionData {
    gyroscope: { alpha: number; beta: number; gamma: number };
    heading: number;
    location: UserLocation;
}

interface ConnectionData {
    connected: boolean;
    message: string;
}

interface OrientationEvent {
    alpha: number;
    beta: number;
    gamma: number;
    webkitCompassHeading: number
}