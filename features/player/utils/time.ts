/**
 * Time formatting helpers for the player UI.
 */

/** "m:ss" clock format for progress labels. */
export const formatClock = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/** "m:ss.d" clock format with tenths — used while scrubbing. */
export const formatClockPrecise = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00.0';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const whole = Math.floor(secs).toString().padStart(2, '0');
    const tenth = Math.floor((secs % 1) * 10);
    return `${mins}:${whole}.${tenth}`;
};

/** "1.50" style seconds with two decimals — used by the A-B loop editor. */
export const formatSeconds2 = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return '0.00';
    return Math.max(0, seconds).toFixed(2);
};
