const tickerArr = [];

const tickerInput = document.getElementById("ticker-input")
const addTickerBtn = document.getElementById("add-ticker-btn")
const tickersList = document.getElementById("tickers-list")
const generateReportBtn = document.querySelector("#ticker-input-form button[type='submit']")



function addTicker(tickerArr){
    addTickerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (tickerArr.length < 3){
            const ticker = tickerInput.value.toUpperCase();
            tickerArr.push(ticker);
            displayTickers(tickerArr);
        } else{
            tickersList.innerHTML = `<li class="error">You can only add up to 3 tickers</li>`
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
        const report = await response.json();
        sessionStorage.setItem("report", report);
        sessionStorage.setItem("tickers", JSON.stringify(tickerArr));
        window.location.href = "/report.html";
    }
    catch(err){
        tickersList.innerHTML = `<li class="error">Something went wrong. Please try again.</li>`;
        console.error(err);
        generateReportBtn.textContent = "Generate Report →";
        generateReportBtn.disabled = false;
    }
})

addTicker(tickerArr);