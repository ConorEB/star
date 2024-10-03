// Device orientation and motion handlers
export const handleDeviceOrientation = (event, setGyroData, setHeading) => {
    const { alpha, beta, gamma, webkitCompassHeading } = event;

    // Calculate the device's heading (azimuth)
    let headingValue = webkitCompassHeading; // alpha is the compass heading in degrees

    // Handle device orientation (portrait vs. landscape)
    if (window.screen.orientation && window.screen.orientation.angle) {
        headingValue += window.screen.orientation.angle;
    }

    headingValue = headingValue % 360; // Ensure the heading is between 0 and 360

    setGyroData({
        alpha: alpha || 0,
        beta: beta || 0,
        gamma: gamma || 0,
    });

    setHeading(headingValue);
};