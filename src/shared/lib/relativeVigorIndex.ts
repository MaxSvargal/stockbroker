import { head, tail } from 'shared/lib/helpers'
import { CandleData } from 'shared/types'

// export const VWMA = (candles: CandleData[]) => {
//   const lastCandlesForVWMA = candles.slice(-4)
//   const weights = lastCandlesForVWMA.map(c => c[2] * c[5]).reduce((a, b) => a + b)
//   const volumes = lastCandlesForVWMA.map(c => c[5]).reduce((a, b) => a + b)
//   return weights / volumes
// }

export const RVIofPeriod = (candles: CandleData[]) => {
  const firstCandle = head(candles)
  const lastCandle = tail(candles)
  const middleCandles = candles.slice(1, -1)

  const movAverage = (
    (firstCandle[2] - firstCandle[1]) +
    (lastCandle[2] - lastCandle[1]) +
    middleCandles.map(c => 2 * (c[2] - c[1])).reduce((a, b) => a + b))

  const rangeAverage = (
    (firstCandle[3] - firstCandle[4]) +
    (lastCandle[3] - lastCandle[4]) +
    middleCandles.map(c => 2 * (c[3] - c[4])).reduce((a, b) => a + b))

  const RVIaverage = movAverage / rangeAverage
  return RVIaverage
}

export const RVIsignalLine = (candles: CandleData[]) => {
  const values = [ ...new Array(4) ]
    .map((_, i) => RVIofPeriod(candles.slice(0, - 1 - i).slice(-10).reverse()))
  return (head(values) + tail(values) + values.slice(1, -1).reduce((a, b) => b + (2 * a), 0)) / 6
}

export const RVIwithVWMA = (candles: CandleData[]) => {
  const RVIaverage = RVIofPeriod(candles.slice(-10).reverse())
  const RVIsignal = RVIsignalLine(candles)
  return [ RVIaverage, RVIsignal ]
}

export default RVIwithVWMA
