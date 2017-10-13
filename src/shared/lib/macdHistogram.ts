export const SMA = (prices: number[]) => prices.reduce((a, b) => a + b, 0) / prices.length

export const EMA = (prices: number[]) => {
  const initialSMA = SMA(prices)
  const multiplier = (2 / (prices.length + 1))
  return prices.reduce((prevEMA, closePrice) =>
    ((closePrice - prevEMA) * multiplier) + prevEMA,
    initialSMA
  )
}

export const MACD = (prices: number[], fastPeriod: number, longPeriod: number) =>
  EMA(prices.slice(-fastPeriod)) - EMA(prices.slice(-longPeriod))

export const signalLine = (prices: number[], fastPeriod: number, longPeriod: number) =>
  EMA([ ...new Array(9) ].map((v, i) => MACD(prices.slice(0, -1 - i), fastPeriod, longPeriod)))

export const MACDHistogram = (prices: number[], fastPeriod: number, longPeriod: number) =>
  MACD(prices, fastPeriod, longPeriod) - signalLine(prices, fastPeriod, longPeriod)
