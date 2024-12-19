
/**
 * Represents the geographical location of a device.
 */
export interface DeviceLocation {
    latitude: number;
    longitude: number;
    altitude: number;
}

/**
 * Represents the gyroscope data of a device.
 */
export interface GyroscopeData {
    alpha: number; // rotation around z axis
    beta: number; // rotation around x axis
    gamma: number; // rotation around y axis
}

/**
 * Represents the motion data of a device, including location and gyroscope data.
 */
export interface MotionData {
    location: DeviceLocation;
    gyroscope: GyroscopeData;
    heading: number; // compass heading in degrees
}

/**
 * Represents all dynamic data related to the tracking status of a satellite in relation to a device.
 */
export interface TrackingStatus {
    azimuthDifference: number; // difference in azimuth between satellite and device
    elevationDifference: number; // difference in elevation between satellite and device
    nextPass: Date | null; // time of next satellite pass
    connected: boolean; // whether the device is connected to the satellite
    message: string; // message to display to the user
}