import debug from 'debug'
import { call, fork, put, select } from 'redux-saga/effects'
import { __, either, reduce, concat, map, append, chain, curry, partial, apply, isEmpty, both, cond, compose, and, all, any, lt, gt, ifElse, always, equals, propEq, last, nth } from 'ramda'

import { CandleData } from 'shared/types'
import { execNewOrder, addMACDResult, addRVIResult, addStochResult } from 'shared/actions'
import { round, tail, now } from 'shared/lib/helpers'
import {
  selectCandles, selectLowestLow, selectHighestHigh,
  selectLastMACDResults, selectHighestBids, selectLowestAsks,
  selectLastRVIResults, selectActivePositions, selectLastStochasticResults
} from 'shared/sagas/selectors'

import stochasticOscillator from 'shared/lib/stochasticOscillator'
import MACDHistogram from 'shared/lib/macdHistogram'
import relativeVigorIndex from 'shared/lib/relativeVigorIndex'

const candlesLength = 39
const MACDFastLength = 12
const MACDLongLength = 26

const isPositive = gt(__,  0)
const isNegative = lt(__,  0)
const isTrue = equals(__, true)
const isLower = (val: number) => lt(__, val)
const isGreater = (val: number) => gt(__, val)

const getValueOfPrev = compose(nth(1), nth(0))
const getValueOfCurr = compose(nth(1), either(nth(1), nth(0)))

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

type GetDecision = { macd: number, rvi: number, rviValue: number, stochValue: number, macdValue: number }
export const getDecision =
  ({ macd, rvi, rviValue, stochValue, macdValue }: GetDecision): number =>
    conditionOfTradePosition({
      buy: all(isTrue, [ isPositive(macd), isNegative(rviValue), isLower(85)(stochValue) ]),
      sell: all(isTrue, [ isNegative(rvi), isPositive(rviValue), isGreater(50)(stochValue), isGreater(1)(macdValue) ])
    })

export function* saveAnalyticsSaga(symbol: string) {
  const candlesKey = `trade:1m:${symbol}`
  const candles = yield select(selectCandles, candlesKey, candlesLength)
  const lowestLow = yield select(selectLowestLow, candlesKey, candlesLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, candlesLength)

  const closePrices = candles.map((c: number[]) => c[2])
  const stochValue = stochasticOscillator(tail(closePrices), lowestLow, highestHigh)
  const macdValue = MACDHistogram(closePrices, MACDFastLength, MACDLongLength)
  const [ RVIaverage, RVIsignal ] = relativeVigorIndex(candles)

  yield put(addStochResult({ symbol, time: now(), value: stochValue }))
  yield put(addMACDResult({ symbol, time: now(), value: macdValue }))
  yield put(addRVIResult({ symbol, time: now(), average: RVIaverage, signal: RVIsignal }))

  yield fork(logResults, symbol, stochValue, macdValue, [ RVIaverage, RVIsignal ])
}

export function* logResults(symbol: string, stoch: number, macd: number, rvi: number[]) {
  const [ bid ] = yield select(selectHighestBids)
  const [ ask ] = yield select(selectLowestAsks)
  debug('worker')(`=== ${symbol} ${bid[0]} / ${ask[0]} | MACD ${round(macd)} | STH ${round(stoch)} | RVI ${round(rvi[0])} / ${round(rvi[1])}`)
}

export function* analyticSaga(symbol: string) {
  const candlesKey = `trade:1m:${symbol}`
  const stochResults = yield select(selectLastStochasticResults, symbol, 1)
  const macdResults = yield select(selectLastMACDResults, symbol, 2)
  const rviResults = yield select(selectLastRVIResults, symbol, 2)

  return  {
    status:
      any(isEmpty)([ macdResults, rviResults, stochResults ]) ? 0 :
        <-1|0|1>getDecision({
          macd: checkMACDState(
            getValueOfPrev(macdResults),
            getValueOfCurr(macdResults)
          ),
          rvi: checkRVIState(
            nth(0, getValueOfPrev(rviResults)),
            nth(1, getValueOfPrev(rviResults)),
            nth(0, getValueOfCurr(rviResults)),
            nth(1, getValueOfCurr(rviResults))
          ),
          macdValue: getValueOfCurr(macdResults),
          rviValue: nth(0, getValueOfCurr(rviResults)),
          stochValue: getValueOfPrev(stochResults)
        })
  }
}
