export const ordinal = (number) => {
    const lastDigit = number % 10;
    switch (lastDigit) {
        case 1:
        return "st";
        case 2:
        return "nd";
        case 3:
        return "rd";
        default:
        return "th";
    }
};

export default ordinal;
