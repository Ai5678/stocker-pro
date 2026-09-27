// Validates the JSON body of POST /report.
export function validateTickers(tickerArr) {
    if(!Array.isArray(tickerArr) || tickerArr.length === 0 || tickerArr.length > 3) {
        return "Provide 1 to 3 ticker symbols.";
    }
    const valid = tickerArr.every(t => typeof t === "string" && /^[A-Z]{1,5}$/.test(t));
    if (!valid) {
        return "Invalid ticker format.";
    }
    return null;
}
