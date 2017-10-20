import debug from 'debug'
import { all, call, fork, put, select } from 'redux-saga/effects'

import { execNewOrder, addMACDResult } from 'shared/actions'
import { round, tail } from 'shared/lib/helpers'
import {
  selectCandles, selectLowestLow, selectHighestHigh,
  selectMACDResults, selectHighestBids, selectLowestAsks
} from 'shared/sagas/selectors'

import stochasticOscillator from 'shared/lib/stochasticOscillator'
import onBalanceVolumes from 'shared/lib/onBalanceVolume'
import MACDHistogram from 'shared/lib/macdHistogram'
import { getPivotPoints, pivotsConclusion } from 'shared/lib/pivotPoins'

const pair = process.env.PAIR
const symbol = `t${pair}`
const candlesKey = `trade:5m:${symbol}`

const stochasticLength = 39
const MACDFastLength = 12
const MACDLongLength = 26
const MACDLimit = 4

const checkMACDForSell = (macd: number[]) =>
  macd[0] > MACDLimit &&
  macd[0] < macd[1] &&
  macd[1] > macd[2] &&
  macd[2] > macd[3] &&
  macd[3] > macd[4]

const checkMACDForBuy = (macd: number[]) =>
  macd[0] < -MACDLimit &&
  macd[0] > macd[1] &&
  macd[1] < macd[2] &&
  macd[2] < macd[3] &&
  macd[3] < macd[4]

const checkCachedNotEqual = () => {
  let prev = 0
  return (val: number): boolean => {
    const res = val !== prev
    prev = val
    return res
  }
}

const isPrevStochasticNotEqual = checkCachedNotEqual()

export function* calcStochastic(closePrices: number[]) {
  const lowestLow = yield select(selectLowestLow, candlesKey, stochasticLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, stochasticLength)
  return stochasticOscillator(closePrices.slice(-1)[0], lowestLow, highestHigh)
}

export function calcMACD(closePrices: number[]) {
  return MACDHistogram(closePrices, MACDFastLength, MACDLongLength)
}

export function* getPricePivotPointsConclusion(closePrice: number) {
  const lowestLow = yield select(selectLowestLow, candlesKey, stochasticLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, stochasticLength)
  const pivotPoints = getPivotPoints(closePrice, lowestLow, highestHigh)
  const priceConclusions = pivotsConclusion(closePrice, pivotPoints)
  return priceConclusions
}

export function getOBVPivotConclusion(OBVs: number[]) {
  const lowestOBV = OBVs.reduce((a, b) => b < a ? b : a)
  const highestOBV = OBVs.reduce((a, b) => b > a ? b : a)
  const pivotPointsOBV = getPivotPoints(tail(OBVs), lowestOBV, highestOBV)
  const OBVConclusions = pivotsConclusion(tail(OBVs), pivotPointsOBV)
  return OBVConclusions
}

export default function* analyticSaga() {
  const [ [ ask ] ] = yield select(selectLowestAsks)
  const [ [ bid ] ] = yield select(selectHighestBids)
  const candles = yield select(selectCandles, candlesKey, stochasticLength)

  const closePrices = candles.map((c: number[]) => c[2])
  const closePricesWithVolumes = candles.map((c: number[]) => [ c[2], c[5] ])
  const closePrice = tail(closePrices)

  const currentStochastic = yield calcStochastic(closePrices)
  const currentMACD = calcMACD(closePrices)
  const OBVs = onBalanceVolumes(closePricesWithVolumes)
  const currentOBV = tail(OBVs)

  const priceConclusions = yield call(getPricePivotPointsConclusion, closePrice)
  const OBVConclusions = getOBVPivotConclusion(OBVs)

  yield put(addMACDResult({ symbol, value: currentMACD }))

  const macdResults = yield select(selectMACDResults, symbol, 5)
  const macd = macdResults.map((m: number) => round(m, 4))
  const stoch = round(currentStochastic, 4)

  debug('worker')(`=== ${symbol} ${bid}/${ask} | MACD ${macd.join('/')} | STH ${stoch} | OBV ${tail(OBVs)} ===`)

  // logic for buy
  if (OBVConclusions.isAbovePivot) {
    debug('worker')(`OBV is above pivot and approve buy`)
    if (priceConclusions.isAbovePivot) {
      debug('worker')(`Price is above pivot and approve buy (not enabled, maybe stop buy?)`)
    }
    if (OBVConclusions.isUpwardFirstResistance) {
      debug('worker')(`OBV is upward resistance level, stop buy.`)
      return { status: false, stoch: stoch }
    }
    if (stoch <= 50) {
      debug('worker')('Stochastic is below 50% and approve buy on value', stoch)
      if(tail(macd) > tail(macd, 2)) {
        debug('worker')('MACD signal to buy for', ask)
        return { status: true, exec: 'buy', stoch }
      }
    }
  }

  // logic for sell
  if (OBVConclusions.isBelowPivot) {
    debug('worker')(`OBV is below pivot and approve sell`)
    if (priceConclusions.isBelowPivot) {
      debug('worker')(`Price is below pivot and approve sell (not enabled)`)
    }
    if (OBVConclusions.isUnderFirstSupport) {
      debug('worker')(`OBV is under support level, stop sell.`)
      return { status: false, stoch: stoch }
    }
    if (stoch >= 50) {
      debug('worker')('Stochastic is under 50% and approve sell on value', stoch)
      if(tail(macd) < tail(macd, 2)) {
        debug('worker')('MACD signal to sell for', ask)
        return { status: true, exec: 'sell', stoch }
      }
    }
  }

  return { status: false, stoch: stoch }
}
