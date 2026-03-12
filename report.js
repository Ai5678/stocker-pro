const report = sessionStorage.getItem("report");
const tickers = JSON.parse(sessionStorage.getItem("tickers") || "[]");
const stockData = JSON.parse(sessionStorage.getItem("stockData") || "[]");

document.getElementById("tickers-subtitle").textContent = `Tickers: ${tickers.join(", ")}`;
document.getElementById("report-body").textContent = report;

const cardContainer = document.getElementById("ticker-cards");

function buildTickerCard(data) {
    const rows = data.results.map(result => {
        const date = new Date(result.t).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"});
        const close = `$${result.c.toFixed(2)}`
        const volume = Math.round(result.v).toLocaleString("en-US");
        return `<tr>
        <td>${date}</td>
        <td>${close}</td>
        <td>${volume}</td>
        </tr>`;
    }).join("");

    const card = document.createElement("div");
    card.className= "ticker-card";
    card.innerHTML = `
        <div>
            <span class="ticker-card-title">${data.ticker}</span>
        </div>
        <table class="ticker-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Close</th>
                    <th>Volume</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>`;
        return card;
}
stockData.forEach(data => cardContainer.appendChild(buildTickerCard(data)));