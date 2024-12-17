import { SatellitePosition } from "./satellite";

export interface DeviceLocation {
    latitude: number;
    longitude: number;
    altitude: number;
}

export interface GyroscopeData {
    alpha: number;
    beta: number;
    gamma: number;
}

export interface MotionData {
    location: DeviceLocation;
    gyroscope: GyroscopeData;
    heading: number;
}

export interface TrackingStatus {
    azimuthDifference: number;
    elevationDifference: number;
    nextPass: Date | null;
    connected: boolean;
    message: string;
}