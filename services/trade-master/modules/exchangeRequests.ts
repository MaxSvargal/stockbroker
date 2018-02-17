type Fetch = (url: string) => Promise<Response>

const BaseApiPath = 'https://api.binance.com/api/v1'

const symbols = (fetch: Fetch) => async () => {
  const res = await fetch(`${BaseApiPath}/exchangeInfo`)
  const json: { symbols: {}[] } = await res.json()
  return json.symbols
}

const ticker = (fetch: Fetch) => async () => {
  const res = await fetch(`${BaseApiPath}/ticker/24hr`)
  const json = await res.json()
  return json
}

const candles = (fetch: Fetch) => async ({ symbol, interval, limit }: { symbol: string, interval: string, limit: number }) => {
    const res = await fetch(`${BaseApiPath}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
    const json = await res.json()
    return json
}

export { symbols, ticker, candles }