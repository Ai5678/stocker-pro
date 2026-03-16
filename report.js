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

function buildTickerCard(data) {
    // handle no data case
    if (!data.results || data.results.length === 0) {
        const card = document.createElement("div");
        card.className = "ticker-card";
        card.innerHTML = `<span class="ticker-card-title">${data.ticker}</span><p>No data available.</p>`;
        return card;
    }

    const rows = data.results.map(result => {
        const date = new Date(result.t).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"});
        const close = result.c != null ? `$${result.c.toFixed(2)}` : "N/A";
        const volume = result.v != null ? Math.round(result.v).toLocaleString("en-US") : "N/A";
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