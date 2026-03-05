import "dotenv/config";
import {GoogleGenAI} from "@google/genai";

async function getStockData(ticker, startDate, endDate){
    const url = `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=120&apiKey=${process.env.POLYGON_API_KEY}`;
    const response = await fetch(url);
    return await response.json();
}


async function generateReport(data){
    const genai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const prompt = `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 200 words describing the stocks performance and recommending whether to buy, hold, or sell. \n${JSON.stringify(data, null, 2)}`;
    console.log(prompt);

    const response = await genai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    })

    console.log(response.text);
}

async function handleGenerateReport(tickerArr, startDate, endDate){
    const allData = await Promise.all(tickerArr.map(ticker => getStockData(ticker, startDate, endDate)))
    await generateReport(allData);
}

await handleGenerateReport(["MSFT", "AAPL", "GOOG"], "2026-03-01", "2026-03-05");