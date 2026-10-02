export function validateTickerInput(input, tickerArr) {
    //trim and uppercase
    const ticker = input.trim().toUpperCase();
    // validate ticker input - empty
    if (!ticker) {
        return {ticker, error: "Please enter a ticker symbol."};
    } // validate ticker input - invalid format
    else if (!/^[A-Z]{1,5}$/.test(ticker)) {
        return {ticker, error: "Invalid ticker format (1–5 letters only)."};
    } // validate ticker input - duplicate
    else if (tickerArr.includes(ticker)) {
        return {ticker, error: `${ticker} is already added.`};
    } // validate ticker input - too many
    else if (tickerArr.length >= 3) {
        return {ticker, error: "You can only add up to 3 tickers."};
    } else {
        return {    ticker, error: null};
    }
}