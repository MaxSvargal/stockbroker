import debug from 'debug'
import { all, fork, put, select } from 'redux-saga/effects'

import { execNewOrder, addMACDResult } from 'shared/actions'
import { round } from 'shared/lib/helpers'
import {
  selectCandles, selectLowestLow, selectHighestHigh,
  selectMACDResults, selectHighestBids, selectLowestAsks
} from 'shared/sagas/selectors'

import stochasticOscillator from 'shared/lib/stochasticOscillator'
import { MACDHistogram } from 'shared/lib/macdHistogram'

const pair = process.env.PAIR
const symbol = `t${pair}`
const candlesKey = `trade:5m:${symbol}`

const MACDLimit = (() => {
  switch (pair) {
    case 'BTCUSD': return 4
    case 'LTCUSD': return 0.02
    default: return 0
  }
})()

const stochasticLength = 39
const MACDFastLength = 12
const MACDLongLength = 26

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

export function* calcStochastic(closePrices: number[]) {
  const lowestLow = yield select(selectLowestLow, candlesKey, stochasticLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, stochasticLength)
  return stochasticOscillator(closePrices.slice(-1)[0], lowestLow, highestHigh)
}

export function calcMACD(closePrices: number[]) {
  return MACDHistogram(closePrices, MACDFastLength, MACDLongLength)
}

const isPrevStochasticNotEqual = checkCachedNotEqual()

export default function* analyticSaga() {
  const [ [ ask ] ] = yield select(selectLowestAsks)
  const [ [ bid ] ] = yield select(selectHighestBids)
  const candles = yield select(selectCandles, candlesKey, stochasticLength)
  const closePrices = candles.map((c: number[]) => c[2])

  const currentStochastic = yield calcStochastic(closePrices)
  const currentMACD = calcMACD(closePrices)

  yield put(addMACDResult({ symbol, value: currentMACD }))

  const macdResults = yield select(selectMACDResults, symbol, 5)
  const macd = macdResults.map((m: number) => round(m, 4))

  debug('worker')(`===== ${symbol} ${bid}/${ask} | MACD ${macd.join('/')} | STH ${round(currentStochastic, 2)} =====`)

  // TODO: check pos/neg volume is upper then previous ???
  if (checkMACDForSell(macd) && isPrevStochasticNotEqual(currentStochastic)) {
    debug('worker')('MACD signal to sell for', bid)
    if (currentStochastic >= 60) {
      debug('worker')('Stochastic approve sell on value', currentStochastic.toFixed(2))
      return { status: true, exec: 'sell' }
    }
  }

  if (checkMACDForBuy(macd) && isPrevStochasticNotEqual(currentStochastic)) {
    debug('worker')('MACD signal to buy for', ask)
    if (currentStochastic <= 40) {
      debug('worker')('Stochastic approve buy on value', currentStochastic.toFixed(2))
      return { status: true, exec: 'buy' }
    }
  }

  return { status: false }
}
