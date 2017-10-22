import debug from 'debug'
import { all, call, fork, put, select } from 'redux-saga/effects'

import { CandleData } from 'shared/types'
import { execNewOrder, addMACDResult } from 'shared/actions'
import { round, tail } from 'shared/lib/helpers'
import {
  selectCandles, selectLowestLow, selectHighestHigh,
  selectMACDResults, selectHighestBids, selectLowestAsks
} from 'shared/sagas/selectors'

import stochasticOscillator from 'shared/lib/stochasticOscillator'
import MACDHistogram from 'shared/lib/macdHistogram'
import relativeVigorIndex from 'shared/lib/relativeVigorIndex'

const pair = process.env.PAIR
const symbol = `t${pair}`
const candlesKey = `trade:1m:${symbol}`

const stochasticLength = 39
const MACDFastLength = 12
const MACDLongLength = 26

type TradePositions = {
  buy: boolean,
  sell: boolean
}

// 6000 / 5970 = 1.005%
// нереализованные чанки

export const checkRVISignal = (() => {
  let prevA: number
  let prevS: number
  let buyState = true
  let sellState = false

  return (currA: number, currS: number) => () => {
    const localBuyState = prevA < prevS && currA > currS
    const localSellState = prevA > prevS && currA < currS

    if (localBuyState !== buyState) debug('worker')(`RVI signal to buy from ${buyState} to ${localBuyState}`)
    if (localSellState !== sellState) debug('worker')(`RVI signal to sell from: ${sellState} to ${localSellState}`)

    buyState = localSellState ? false : (localBuyState || buyState)
    sellState = localBuyState ? false : (localSellState || sellState)

    const conclj = {
      buy: buyState || localBuyState,
      sell: sellState || localSellState
    }

    prevA = currA
    prevS = currS
    return conclj
  }
})()

export const approveMACDSignal = (() => {
  let prev: number
  return (curr: number) =>
    ({ buy, sell }: TradePositions) => () => {
      const result = {
        buy: (buy && (prev < 0 && curr > 0)),
        sell: (sell && (prev > 0 && curr < 0)) // may be instantly?
      }
      prev = curr
      return result
    }
})()

const logResults = (stoch: number) => ({ buy, sell }: TradePositions) => {
  debug('worker')(`Functional Signal. Buy: ${buy}, Sell: ${sell}`)
  return { status: (buy || sell), stoch }
}

const waterfall = (...fns: Function[]) =>
  fns.reduce((a, b) => b(a()))

export default function* analyticSaga() {
  const [ [ ask ] ] = yield select(selectLowestAsks)
  const [ [ bid ] ] = yield select(selectHighestBids)
  const candles = yield select(selectCandles, candlesKey, stochasticLength)
  const lowestLow = yield select(selectLowestLow, candlesKey, stochasticLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, stochasticLength)

  const closePrices = candles.map((c: number[]) => c[2])
  const closePricesWithVolumes = candles.map((c: number[]) => [ c[2], c[5] ])
  const closePrice = tail(closePrices)

  const currentStochastic = stochasticOscillator(tail(closePrices), lowestLow, highestHigh)
  const currentMACD = MACDHistogram(closePrices, MACDFastLength, MACDLongLength)
  const [ RVIaverage, RVIsignal ] = relativeVigorIndex(candles)

  yield put(addMACDResult({ symbol, value: currentMACD }))

  const macdResults = yield select(selectMACDResults, symbol, 5)
  const macd = macdResults.map((m: number) => round(m, 4))
  const currMACD = tail(macd)
  const stoch = round(currentStochastic, 4)

  debug('worker')(`=== ${symbol} ${bid} / ${ask} / ${closePrice} | MACD ${tail(macd)} | STH ${stoch} | RVI ${round(RVIaverage)} / ${round(RVIsignal)}`)

  return waterfall(
    checkRVISignal(RVIaverage, RVIsignal),
    approveMACDSignal(currMACD),
    logResults(stoch))
}
