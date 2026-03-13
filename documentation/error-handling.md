# Error & Edge Case Handling

This document covers the edge cases identified across script.js, report.js, and server.js, and the code changes made to handle them.

---

## script.js

### Edge Cases & Suggestions

| Edge Case | Suggestion |
|---|---|
| Empty ticker input (user clicks "Add" with blank field) | Validate `ticker.trim()` is not empty before pushing |
| Duplicate tickers | Check `tickerArr.includes(ticker)` before pushing |
| Invalid ticker format | Validate with regex `/^[A-Z]{1,5}$/` after `.toUpperCase()` |
| Error message persists after a valid ticker is added | Error messages are only shown inside conditional branches; `displayTickers` only runs on a valid add |
| Server returns non-2xx but no exception is thrown | Check `response.ok` and throw before parsing JSON |

### Changes Made

1. In `addTicker()`, validate the input before pushing to the array. Checks are done in order: empty → invalid format → duplicate → too many.

--quote--
function addTicker(tickerArr) {
    addTickerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const ticker = tickerInput.value.trim().toUpperCase();

        if (!ticker) {
            tickersList.innerHTML = `<li class="error">Please enter a ticker symbol.</li>`;
        } else if (!/^[A-Z]{1,5}$/.test(ticker)) {
            tickersList.innerHTML = `<li class="error">Invalid ticker format (1–5 letters only).</li>`;
        } else if (tickerArr.includes(ticker)) {
            tickersList.innerHTML = `<li class="error">${ticker} is already added.</li>`;
        } else if (tickerArr.length >= 3) {
            tickersList.innerHTML = `<li class="error">You can only add up to 3 tickers.</li>`;
        } else {
            tickerArr.push(ticker);
            displayTickers(tickerArr);
        }

        tickerInput.value = "";
    });
}
--end quote--

2. In the `generateReportBtn` click handler, check `response.ok` before parsing JSON. If the server returned an error status, throw it so the catch block handles it and shows the message to the user.

--quote--
const response = await fetch("/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tickerArr),
});
if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || "Server error.");
}
const { report, stockData } = await response.json();
--end quote--

---

## report.js

### Edge Cases & Suggestions

| Edge Case | Suggestion |
|---|---|
| Direct navigation to `report.html` (sessionStorage is empty) | Check for missing data at the top and redirect to `/` |
| `data.results` is null/undefined for a ticker with no data | Guard in `buildTickerCard` and render a "No data available" message |
| `result.c` (close price) or `result.v` (volume) is null | Use nullish fallback: `result.c != null ? ... : "N/A"` |

### Changes Made

1. Guard at the top of the file. If `report` or `stockData` is missing (e.g. user navigated directly to report.html), redirect back to the home page.

--quote--
const report = sessionStorage.getItem("report");
const tickers = JSON.parse(sessionStorage.getItem("tickers") || "[]");
const stockData = JSON.parse(sessionStorage.getItem("stockData") || "[]");

if (!report || !stockData.length) {
    window.location.href = "/";
}
--end quote--

2. In `buildTickerCard()`, guard against missing `data.results` before mapping over it. Also handle null close/volume values.

--quote--
function buildTickerCard(data) {
    if (!data.results || data.results.length === 0) {
        const card = document.createElement("div");
        card.className = "ticker-card";
        card.innerHTML = `<span class="ticker-card-title">${data.ticker}</span><p>No data available.</p>`;
        return card;
    }

    const rows = data.results.map(result => {
        const date = new Date(result.t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const close = result.c != null ? `$${result.c.toFixed(2)}` : "N/A";
        const volume = result.v != null ? Math.round(result.v).toLocaleString("en-US") : "N/A";
        return `<tr>
        <td>${date}</td>
        <td>${close}</td>
        <td>${volume}</td>
        </tr>`;
    }).join("");
    ...
}
--end quote--

---

## server.js

### Edge Cases & Suggestions

| Edge Case | Suggestion |
|---|---|
| `data.results` is undefined when ticker is invalid or API returns an error | Guard before `.slice()` and throw a descriptive error |
| Missing `POLYGON_API_KEY` or `GEMINI_API_KEY` env vars | Check at startup and exit with a clear message |
| `tickerArr` from `req.body` is not validated | Validate it's an array of 1–3 non-empty strings before proceeding |
| No error handling in `/report` route | Wrap in `try/catch`, return `res.status(500).json({ error })` on failure |
| Weekend/holiday date range returns fewer than 3 results | Extend lookback window from 5 to 10 days to ensure 3 trading days are always available |

### Changes Made

1. Check for missing env vars at startup. The server exits immediately with a clear message rather than crashing later with a confusing error.

--quote--
if (!process.env.POLYGON_API_KEY || !process.env.GEMINI_API_KEY) {
    console.error("Missing required API keys in .env");
    process.exit(1);
}
--end quote--

2. Guard `data.results` in `getStockData`. If the API returns no results (e.g. invalid ticker), throw an error with the ticker name so the caller knows which one failed.

--quote--
async function getStockData(ticker, startDate, endDate) {
    const url = `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=desc&apiKey=${process.env.POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`No data found for ticker: ${ticker}`);
    }
    data.results = data.results.slice(0, 3).reverse();
    return data;
}
--end quote--

3. Extend the lookback window in `getDateRange` from 5 to 10 days.

The stock market is closed on weekends and public holidays. A 5-day lookback can sometimes return fewer than 3 trading days (e.g. after a long weekend). 10 days comfortably guarantees 3 trading days in all realistic scenarios. The `.slice(0, 3)` call in `getStockData` still trims the results to exactly 3.

--quote--
function getDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 10); // extended from 5 to cover weekends/holidays
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}
--end quote--

4. Validate `tickerArr` and wrap the `/report` handler in `try/catch`. Returns a 400 for bad input and a 500 for unexpected failures, with a JSON error message the frontend can display.

--quote--
app.post("/report", async (req, res) => {
    const tickerArr = req.body;
    if (!Array.isArray(tickerArr) || tickerArr.length === 0 || tickerArr.length > 3) {
        return res.status(400).json({ error: "Provide 1 to 3 ticker symbols." });
    }
    const valid = tickerArr.every(t => typeof t === "string" && /^[A-Z]{1,5}$/.test(t));
    if (!valid) {
        return res.status(400).json({ error: "Invalid ticker format." });
    }
    try {
        const { startDate, endDate } = getDateRange();
        const allData = await Promise.all(tickerArr.map(ticker => getStockData(ticker, startDate, endDate)));
        const report = await generateReport(allData);
        res.json({ report, stockData: allData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Failed to generate report." });
    }
});
--end quote--

Note on `tickerArr.every(...)`: `.every()` returns a boolean — true if ALL items pass the check, false as soon as one fails. It is preferred over `.forEach` here because it short-circuits (stops early on the first failure) and returns a usable boolean directly, whereas `.forEach` has no return value.
