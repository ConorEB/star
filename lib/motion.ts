// Device orientation and motion handlers
// @ts-expect-error setMotionData is a function
export const handleDeviceOrientation = (event: OrientationEvent, setMotionData) => {
    const { alpha, beta, gamma, webkitCompassHeading } = event;

    // Calculate the device's heading (azimuth)
    let headingValue = webkitCompassHeading; // alpha is the compass heading in degrees

    // Handle device orientation (portrait vs. landscape)
    if (window.screen.orientation && window.screen.orientation.angle) {
        headingValue += window.screen.orientation.angle;
    }

    headingValue = headingValue % 360; // Ensure the heading is between 0 and 360

    setMotionData((prevData: MotionData) => ({
        ...prevData,
        heading: headingValue,
        gryoscope: { alpha, beta, gamma }
    })
    )
};