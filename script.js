const tickerArr = [];
console.log(tickerArr);

const tickerInput = document.getElementById("ticker-input")
const addTickerBtn = document.getElementById("add-ticker-btn")
const tickersList = document.getElementById("tickers-list")

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
    tickersList.innerHTML = "Your tickers: " + tickerArr.map(ticker => `<li>${ticker}</li>`).join("");
}

addTicker(tickerArr);