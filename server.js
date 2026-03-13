import "dotenv/config";
import express from "express";
import {GoogleGenAI} from "@google/genai";

const app = express();
app.use(express.json())
app.use(express.static('.'))


function getDateRange(){
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 10)
    return {
        startDate: startDate.toISOString().split('T')[0], 
        endDate: endDate.toISOString().split('T')[0]};
}

async function getStockData(ticker, startDate, endDate){
    const url = `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=desc&apiKey=${process.env.POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`No data found for ticker: ${ticker}`);
    }
    data.results = data.results.slice(0, 3).reverse();
    return data;
}


async function generateReport(data){
    const genai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const prompt = `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 200 words describing the stocks performance and recommending whether to buy, hold, or sell. \n${JSON.stringify(data, null, 2)}`;
    console.log(prompt);

    const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })
    return response.text;
}

app.post("/report", async (req, res) => {
    const tickerArr = req.body;
    if (!Array.isArray(tickerArr) || tickerArr.length === 0 || tickerArr.length > 3) {
        return res.status(400).json({ error: "Provide 1 to 3 ticker symbols." });
    }
    const valid = tickerArr.every(t => typeof t === "string" && /^[A-Z]{1,5}$/.test(t));
    if (!valid) {
        return res.status(400).json({ error: "Invalid ticker format." });
    }
    try{
        const {startDate, endDate} = getDateRange();
        const allData = await Promise.all(tickerArr.map(ticker => getStockData(ticker, startDate, endDate)));
        const report = await generateReport(allData);
        res.json({report, stockData: allData});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: error.message || "Failed to generate report." });
    }
})

app.listen(3000, (error) => {
    if (!error) {
        console.log("Server is running on port 3000");
    } else {
        console.log("Error: ", error);
    }
});