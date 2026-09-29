import "dotenv/config";
import express from "express";
import {GoogleGenAI} from "@google/genai";
import { fileURLToPath } from "url";
import path from "path";
import { validateTickers } from "./lib/validation.js";
import { getDateRange, getStockData } from "./lib/marketData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.POLYGON_API_KEY || !process.env.GEMINI_API_KEY) {
    console.error("Missing required API keys in .env");
    process.exit(1);
}

const app = express();
app.use(express.json())
app.use(express.static(__dirname))


async function generateReport(data){
    const genai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const prompt = `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 200 words describing the stocks performance and recommending whether to buy, hold, or sell. \n${JSON.stringify(data, null, 2)}`;

    const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })
    return response.text;
}

app.post("/report", async (req, res) => {
    const tickerArr = req.body;
    const validationError = validateTickers(tickerArr);
    if (validationError) {
        return res.status(400).json({ error: validationError });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.log("Error: ", error);
    }
});

export default app;