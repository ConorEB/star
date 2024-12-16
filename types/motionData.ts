export interface DeviceLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
}

export interface GyroscopeData {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}

export interface MotionData {
    location: DeviceLocation;
    gyroscope: GyroscopeData;
    heading: number;
}