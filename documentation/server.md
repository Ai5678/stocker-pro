1. Setting limit in the query url does not work. Therefore, calling data in desc order (newest to oldest), then using slice() to get the first 3, then .reverse is to have data in asc order (oldest to newest) 
--quote--
data.results = data.results.slice(0, 3).reverse();
--end quote--
2. getStockData(ticker, startDate, endDate) returns data obj.

--quote--
{
  ticker: 'AAPL',
  queryCount: 4,
  resultsCount: 4,
  adjusted: true,
  results: [
    {
      v: 41120042.153782,
      vw: 257.0768,
      o: 258.63,
      c: 257.46,
      h: 258.77,
      l: 254.37,
      t: 1772773200000,
      n: 621278
    },
    {
      v: 49658626.692641,
      vw: 259.8254,
      o: 260.79,
      c: 260.29,
      h: 261.555,
      l: 257.25,
      t: 1772686800000,
      n: 758529
    },
    {
      v: 39803119.557613,
      vw: 263.2544,
      o: 264.65,
      c: 262.52,
      h: 266.15,
      l: 261.42,
      t: 1772600400000,
      n: 637658
    },
    {
      v: 38568921.672138,
      vw: 263.1124,
      o: 263.48,
      c: 263.75,
      h: 265.56,
      l: 260.13,
      t: 1772514000000,
      n: 627107
    }
  ],
  status: 'DELAYED',
  request_id: 'e54ad52811c9d89190e26f69236f3a2a',
  count: 4,
  next_url: 'https://api.massive.com/v2/aggs/ticker/AAPL/range/1/day/2026-03-01/1772513999999?cursor=bGltaXQ9MyZzb3J0PWRlc2M'
}
--end quote--

3. In generateReport(data), use JSON.stringify(data) to turn the object to JSON string. (, null, 2) to make pretty-printing

4. function generateReport(data) returns the "string" of response.text. AI full Response (response) is an object. Therefore, report from generateReport(allData) is string. (res.json(report) = string)