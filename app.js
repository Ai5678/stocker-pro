import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { validateTickers } from "./lib/validation.js";
import { getDateRange, getStockData } from "./lib/marketData.js";
import {generateReport} from "./lib/gemini.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json())
app.use(express.static(__dirname))

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

export default app;
