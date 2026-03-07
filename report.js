const report = sessionStorage.getItem("report");
const tickers = JSON.parse(sessionStorage.getItem("tickers") || "[]");

    document.getElementById("tickers-subtitle").textContent =
        `Tickers: ${tickers.join(", ")}`;
    document.getElementById("report-body").textContent = report;
