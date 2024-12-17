/**
 * Formats a given date into a string with the format 'MM/DD/YY, HH:MM'.
 * If the date is null, it returns null.
 *
 * @param date - The date to format.
 * @returns The formatted date string or null if the date is null.
 */
export function formatDate(date: Date | null): string | null {
    if (!date) return null;

    return date.toLocaleString([], {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Converts an angle from radians to degrees.
 *
 * @param radians - The angle in radians.
 * @returns The angle in degrees.
 */
export const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
};

/**
 * Translates an elevation value to a valid pixel value to display on screen in the direction guide component.
 *
 * @param elevation - The elevation value to translate.
 * @returns The translated elevation value (in correct pixel unit range)
 */
export const translateElevation = (elevation: number) => {
    if (elevation < 0) return (elevation / 1.4);
    if (elevation > 0) return (elevation / 1.4);
    return 0;
}