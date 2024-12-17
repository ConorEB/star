import { SatellitePosition } from "./satellite";

export interface DeviceLocation {
    latitude: number | null;
    longitude: number | null;
    altitude?: number | null;
}

export interface GyroscopeData {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}

export interface MotionData {
    location: DeviceLocation;
    gyroscope: GyroscopeData;
    heading: number | null;
}

export interface TrackingStatus {
    azimuthDifference: number | null;
    elevationDifference: number | null;
    nextPass: Date | null;
    connected: boolean;
    message: string;
}