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

export const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
};