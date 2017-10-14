import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, put, select } from 'redux-saga/effects'
import RPCSaga from 'shared/sagas/rpc'
import { execNewOrder, addStochasticResult, addMACDResult } from 'shared/actions'
import { selectCandles, selectTickerBySymbol, selectLowestLow, selectHighestHigh, selectMACDResults, selectStochasticResults } from 'shared/sagas/selectors'
import stochasticOscillator from 'shared/lib/stochasticOscillator'
import { MACDHistogram, SMA, EMA } from 'shared/lib/macdHistogram'
import { CandleData } from 'shared/types'

const { ACCOUNT, PAIR, AMOUNT } = process.env
if (!PAIR || !AMOUNT) throw Error('No pair or amount will passed by environment')
// const AMOUNT = Number(AMOUNT)
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

export function* analyticsSaga() {
  let stochasticsCache = []
  let macdCache = []

  while (true) {

    const candles = yield select(selectCandles, candlesKey, stochasticLength)
    const ticker = yield select(selectTickerBySymbol, SYMBOL)
    const [ bid, _, ask ] = ticker

    const closePrices = candles.map((c: number[]) => c[2])
    const currentClosePrice = closePrices.slice(-1)[0]
    const prevClosePrice = closePrices.slice(-2, -1)[0]

    const currentStochastic = yield calcStochastic(closePrices)
    const currentMACD = calcMACD(closePrices)
    // const lastStableMACD = calcMACD(closePrices.slice(0, -1))

    yield put(addMACDResult(currentMACD))
    const macdResults = yield select(selectMACDResults, 4)
    const macd = macdResults.map(round)

    debug('worker')(`===== ${SYMBOL} ${bid}/${ask} | MACD ${macd.join('/')} | STH ${round(currentStochastic)} =====`)

    if (
      allIsPositive(macd) &&
      macd[0] < macd[1] &&
      macd[1] > macd[2] &&
      macd[2] < macd[3] &&
      macd[3] < macd[4]
    ) {
      debug('worker')('MACD signal to sell for', ask)
      if (currentStochastic >= 60)
        debug('worker')('Stochastic approve sell on value', parseInt(currentStochastic))
    }

    if (
      allIsNegative(macd) &&
      macd[0] > macd[1] &&
      macd[1] < macd[2] &&
      macd[2] > macd[3] &&
      macd[3] > macd[4]
    ) {
      debug('worker')('MACD signal to buy for', ask)
      if (currentStochastic <= 40)
        debug('worker')('Stochastic approve buy on value', parseInt(currentStochastic))
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
