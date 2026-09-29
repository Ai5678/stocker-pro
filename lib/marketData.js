// Market data (api.massive.com, formerly Polygon).
// getStockData is the only function here that makes a network call — mock it (or fetch) in tests.

// `now` defaults to the real current time; tests can pass a fixed date instead.
export function getDateRange(now = new Date()){
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 10)
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]};
}

// Pure: takes the parsed API response and returns it with only the 3 most recent days, oldest first.
// Throws when there are no results.
export function shapeStockData(data, ticker){
    if (!data.results || data.results.length === 0) {
        throw new Error(`No data found for ticker: ${ticker}`);
    }
    data.results = data.results.slice(0, 3).reverse();
    return data;
}

export async function getStockData(ticker, startDate, endDate){
    const url = `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=desc&apiKey=${process.env.POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return shapeStockData(data, ticker);
}
