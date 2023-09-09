// create a helper function to convert ms to seconds with 3 decimal places
export const toSeconds = (ms, decimals = 3) => {
    return (ms / 1000).toFixed(decimals);
}

// create a helper function that converts ms to seconds or minutes with 3 decimal places
export const toSecondsOrMinutes = (ms, decimals = 3) => {
    const seconds = toSeconds(ms, decimals);
    if (seconds < 60) {
        return (ms / 1000).toFixed(decimals);
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(decimals);
    return `${minutes}:${remainingSeconds}`;
}

export default toSeconds;
