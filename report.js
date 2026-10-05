import {buildTickerCard} from "./tickerCard.js";

const report = sessionStorage.getItem("report");
const tickers = JSON.parse(sessionStorage.getItem("tickers") || "[]");
const stockData = JSON.parse(sessionStorage.getItem("stockData") || "[]");

// Guard: redirect if navigated directly without data
if (!report || !stockData.length) {
    window.location.href = "/";
}

document.getElementById("tickers-subtitle").textContent = `Tickers: ${tickers.join(", ")}`;
document.getElementById("report-body").textContent = report;

const cardContainer = document.getElementById("ticker-cards");

stockData.forEach(data => cardContainer.appendChild(buildTickerCard(data)));