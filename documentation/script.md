1. in sessionStorage, it stores report and tickersin key: value pair

--example--
report: "Alright, astute investors, let's dissect the recent market movements and pinpoint our next strategic plays!

**Microsoft (MSFT):** We've observed a robust performance from MSFT over the past three days. The stock surged from $405.20 to an impressive $410.68 before a minor pullback to $408.96. This slight correction, following significant gains, suggests healthy consolidation rather than a reversal. The underlying strength remains evident, indicating strong investor confidence.
**Recommendation: HOLD.** Continue to monitor closely, but MSFT is poised for further upside.

**Alphabet (GOOG):** The trajectory for GOOG tells a different story. The stock has experienced a steady decline, falling from $303.45 to $300.91, and further to $298.30. This consistent downward pressure, without any significant signs of a rebound, points to weakening momentum and a lack of buying interest.
**Recommendation: SELL.** It's prudent to exit this position or avoid new entry until a clear bullish reversal signal emerges.

Stay disciplined, and let the data guide your decisions!"

tickers: ["MSFT", "GOOG"]

2. sessionStorage only stores string. report is a string (generateReport(alldata) return string) -> store it directly. Whereas tickerArr -> must be converted to string first using JSON.stringify()

--quote--
sessionStorage.setItem("report", report);
sessionStorage.setItem("tickers", JSON.stringify(tickerArr));
--end quote--

3. When read the value back in report.js, tickers is needed to be reverted the conversion, but report is not.

--quote--
const report = sessionStorage.getItem("report");
const tickers = JSON.parse(sessionStorage.getItem("tickers") || "[]");
--end quote--