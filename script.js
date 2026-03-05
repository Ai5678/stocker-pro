const tickerArr = [];
console.log(tickerArr);

const tickerInput = document.getElementById("ticker-input")
const addTickerBtn = document.getElementById("add-ticker-btn")

function addTicker(tickerArr){
    addTickerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (tickerArr.length < 3){
            const ticker = tickerInput.value.toUpperCase();
            tickerArr.push(ticker);
            console.log(tickerArr);
        }
        tickerInput.value = "";
    })
}
addTicker(tickerArr);