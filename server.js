import "dotenv/config";

const ticker ="MSFT"
const startDate = "2026-03-01";
const endDate = "2026-03-05";

const url = `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=120&apiKey=${process.env.POLYGON_API_KEY}`;

const response = await fetch(url);
const data = await response.json();
console.log(data);