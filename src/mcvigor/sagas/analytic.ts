import debug from 'debug'
import { call, fork, put, select } from 'redux-saga/effects'

import { CandleData } from 'shared/types'
import { execNewOrder, addMACDResult, addRVIResult } from 'shared/actions'
import { round, tail, now } from 'shared/lib/helpers'
import {
  selectCandles, selectLowestLow, selectHighestHigh,
  selectLastMACDResult, selectHighestBids, selectLowestAsks,
  selectLastRVIResult
} from 'shared/sagas/selectors'

import stochasticOscillator from 'shared/lib/stochasticOscillator'
import MACDHistogram from 'shared/lib/macdHistogram'
import relativeVigorIndex from 'shared/lib/relativeVigorIndex'

const { PAIR } = process.env
const symbol = `t${PAIR}`
const candlesKey = `trade:1m:${symbol}`

const stochasticLength = 39
const MACDFastLength = 12
const MACDLongLength = 26

import { __, and, all, lt, gt, ifElse, always, equals, propEq, last, nth } from 'ramda'

const conditionOfTradePosition =
  ifElse(
    propEq('buy', true),
    always(1),
    ifElse(
      propEq('sell', true),
      always(-1),
      always(0)
    ))

export const checkRVIState =
  (prevA: number, prevS: number, currA: number, currS: number): number =>
    conditionOfTradePosition({
      buy: and(lt(prevA, prevS), gt(currA, currS)),
      sell: and(gt(prevA, prevS), lt(currA, currS))
    })

export const checkMACDState =
  (prev: number, curr: number): number =>
    conditionOfTradePosition({
      buy: and(lt(prev, 0), gt(curr, 0)),
      sell: and(gt(prev, 0), lt(curr, 0))
    })

const isPositive = gt(__,  0)
const isNegative = lt(__,  0)
const isAboveOne = gt(__, 1)
const isTrue = equals(__, true)
const isLower = (val: number) => lt(__, val)
const isGreater = (val: number) => gt(__, val)

type GetDecision = { macd: number, rvi: number, rviValue: number, stochValue: number, macdValue: number }
export const getDecision =
  ({ macd, rvi, rviValue, stochValue, macdValue }: GetDecision): number =>
    conditionOfTradePosition({
      buy: all(isTrue, [ isPositive(macd), isNegative(rviValue), isLower(85)(stochValue) ]),
      sell: all(isTrue, [ isNegative(rvi), isPositive(rviValue), isGreater(50)(stochValue), isAboveOne(macdValue) ])
    })

export default function* analyticSaga() {
  const [ [ ask ] ] = yield select(selectLowestAsks)
  const [ [ bid ] ] = yield select(selectHighestBids)
  const candles = yield select(selectCandles, candlesKey, stochasticLength)
  const lowestLow = yield select(selectLowestLow, candlesKey, stochasticLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, stochasticLength)
  const [ , prevMACDResult ] = yield select(selectLastMACDResult, symbol)
  const [ , prevRVIAverage, prevRVISignal ] = yield select(selectLastRVIResult, symbol)

  const closePrices = candles.map((c: number[]) => c[2])
  const closePricesWithVolumes = candles.map((c: number[]) => [ c[2], c[5] ])
  const closePrice = tail(closePrices)

  const currentStochastic = stochasticOscillator(tail(closePrices), lowestLow, highestHigh)
  const currentMACD = MACDHistogram(closePrices, MACDFastLength, MACDLongLength)
  const [ RVIaverage, RVIsignal ] = relativeVigorIndex(candles)

  // TODO: check enabled signal from RVI and then buy on MACD signal
  //// then turn off rvi state and wait for next RVI signal
  const decision = getDecision({
    macd: checkMACDState(prevMACDResult, currentMACD),
    rvi: checkRVIState(prevRVIAverage, prevRVISignal, RVIaverage, RVIsignal),
    rviValue: RVIaverage,
    stochValue: currentStochastic,
    macdValue: prevMACDResult
  })

  yield put(addMACDResult({ symbol, time: now(), value: currentMACD }))
  yield put(addRVIResult({ symbol, time: now(), average: RVIaverage, signal: RVIsignal }))

  debug('worker')(`=== ${symbol} ${bid} / ${ask} / ${closePrice} | MACD ${round(currentMACD)} | STH ${round(currentStochastic)} | RVI ${round(RVIaverage)} / ${round(RVIsignal)}`)
  decision === 1 && debug('worker')(`Buy signal for ${bid}`)
  decision === -1 && debug('worker')(`Sell signal for ${ask}`)

  return { status: false }
}
