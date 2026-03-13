const tickerArr = [];

const tickerInput = document.getElementById("ticker-input")
const addTickerBtn = document.getElementById("add-ticker-btn")
const tickersList = document.getElementById("tickers-list")
const generateReportBtn = document.querySelector("#ticker-input-form button[type='submit']")



function addTicker(tickerArr){
    addTickerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const ticker = tickerInput.value.trim().toUpperCase();
        // validate ticker input - empty
        if (!ticker) {
            tickersList.innerHTML = `<li class="error">Please enter a ticker symbol.</li>`;
        } // validate ticker input - invalid format
        else if (!/^[A-Z]{1,5}$/.test(ticker)) {
            tickersList.innerHTML = `<li class="error">Invalid ticker format (1–5 letters only).</li>`;
        } // validate ticker input - duplicate
        else if (tickerArr.includes(ticker)) {
            tickersList.innerHTML = `<li class="error">${ticker} is already added.</li>`;
        } // validate ticker input - too many
        else if (tickerArr.length >= 3) {
            tickersList.innerHTML = `<li class="error">You can only add up to 3 tickers.</li>`;
        } else {
            tickerArr.push(ticker);
            displayTickers(tickerArr);
        }

        tickerInput.value = "";
    })
}

function displayTickers(tickerArr){
    tickersList.innerHTML = tickerArr.map(ticker => `<li>${ticker}</li>`).join("");
}

generateReportBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (tickerArr.length === 0) {
        tickersList.innerHTML = `<li class="error">Please add at least one ticker</li>`;
        return;
    }
    generateReportBtn.textContent = "Generating...";
    generateReportBtn.disabled = true;
    try{
        const response = await fetch ("/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tickerArr),
        });
        if (!response.ok) {
            const {error} = await response.json();
            throw new Error(error || "Server error.");
        }
        const {report, stockData} = await response.json();
        sessionStorage.setItem("report", report);
        sessionStorage.setItem("tickers", JSON.stringify(tickerArr));
        sessionStorage.setItem("stockData", JSON.stringify(stockData));
        window.location.href = "/report.html";
    }
    catch(err){
        tickersList.innerHTML = `<li class="error">${err.message}</li>`;
        console.error(err);
        generateReportBtn.textContent = "Generate Report →";
        generateReportBtn.disabled = false;
    }
})

addTicker(tickerArr);