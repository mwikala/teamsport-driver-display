// create a helper function to convert ms to seconds with 3 decimal places
export const toSeconds = (ms, decimals = 3) => {
    return (ms / 1000).toFixed(decimals);
}

export default toSeconds;
