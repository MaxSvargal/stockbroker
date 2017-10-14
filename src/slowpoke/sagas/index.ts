import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, put, select } from 'redux-saga/effects'
import RPCSaga from 'shared/sagas/rpc'
import { execNewOrder, addStochasticResult, addMACDResult } from 'shared/actions'
import { selectCandles, selectTickerBySymbol, selectLowestLow, selectHighestHigh, selectMACDResults, selectHighestBids, selectLowestAsks } from 'shared/sagas/selectors'
import stochasticOscillator from 'shared/lib/stochasticOscillator'
import { MACDHistogram, SMA, EMA } from 'shared/lib/macdHistogram'
import { CandleData } from 'shared/types'

const { ACCOUNT, PAIR } = process.env
if (!PAIR) throw Error('No pair or amount will passed by environment')
// const AMOUNT = Number(AMOUNT)
const AMOUNT = 0.005
const SYMBOL = `t${PAIR}`
const candlesKey = `trade:5m:${SYMBOL}`

const round = (num: number) => parseFloat(num.toFixed(2))
const allIsPositive = (arr: number[]): boolean => arr.map(n => n > 0).reduce((a, b) => a && b)
const allIsNegative = (arr: number[]): boolean => arr.map(n => n < 0).reduce((a, b) => a && b)

const stochasticLength = 39
const MACDFastLength = 12
const MACDLongLength = 26

export function* calcStochastic(closePrices: number[]) {
  const lowestLow = yield select(selectLowestLow, candlesKey, stochasticLength)
  const highestHigh = yield select(selectHighestHigh, candlesKey, stochasticLength)
  return stochasticOscillator(closePrices.slice(-1)[0], lowestLow, highestHigh)
}

export function calcMACD(closePrices: number[]) {
  return MACDHistogram(closePrices, MACDFastLength, MACDLongLength)
}

export function* doBuySaga() {
  const [ ask, reserveAsk ] = yield select(selectLowestAsks)
  const price = ask[2] >= AMOUNT ? ask[0] : reserveAsk[0]
  yield put(execNewOrder({ symbol: SYMBOL, amount: AMOUNT, price: price }))
}

export function* doSellSaga() {
  const [ bid, reserveBid ] = yield select(selectHighestBids)
  const price = bid[2] >= AMOUNT ? bid[0] : reserveBid[0]
  yield put(execNewOrder({ symbol: SYMBOL, amount: -AMOUNT, price: price }))
}

export function* analyticsSaga() {
  // yield put(clearMACDResults)

  while (true) {

    const candles = yield select(selectCandles, candlesKey, stochasticLength)
    const [ [ ask ] ] = yield select(selectLowestAsks)
    const [ [ bid ] ] = yield select(selectHighestBids)

    const closePrices = candles.map((c: number[]) => c[2])
    const currentClosePrice = closePrices.slice(-1)[0]
    const prevClosePrice = closePrices.slice(-2, -1)[0]

    const currentStochastic = yield calcStochastic(closePrices)
    const currentMACD = calcMACD(closePrices)
    // const lastStableMACD = calcMACD(closePrices.slice(0, -1))

    // TODO: PAIRS CONFLICTS
    yield put(addMACDResult(currentMACD))
    const macdResults = yield select(selectMACDResults, 5)
    const macd = macdResults.map(round)

    debug('worker')(`===== ${SYMBOL} ${bid}/${ask} | MACD ${macd.join('/')} | STH ${round(currentStochastic)} =====`)

    if (
      allIsPositive(macd) &&
      macd[0] > 5 &&
      macd[0] < macd[1] &&
      macd[1] > macd[2] &&
      macd[2] > macd[3] &&
      macd[3] > macd[4]
    ) {
      debug('worker')('MACD signal to sell for', bid)
      if (currentStochastic >= 60) {
        debug('worker')('Stochastic approve sell on value', parseInt(currentStochastic))
        yield fork(doSellSaga)
      }
    }

    if (
      allIsNegative(macd) &&
      macd[0] < -5 &&
      macd[0] > macd[1] &&
      macd[1] < macd[2] &&
      macd[2] < macd[3] &&
      macd[3] < macd[4]
    ) {
      debug('worker')('MACD signal to buy for', ask)
      if (currentStochastic <= 40) {
        debug('worker')('Stochastic approve buy on value', parseInt(currentStochastic))
        yield fork(doBuySaga)
      }
    }

    yield delay(10000)
  }
}

export default function* rootSaga() {
  yield all([
    fork(analyticsSaga),
    fork(RPCSaga)
  ])
}
