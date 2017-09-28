import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, select, put } from 'redux-saga/effects'
import { selectCandles, selectTicker, selectLowestLow, selectHighestHigh } from './selectors'
import vertexIndicator from 'trader/lib/vertexIndicator'
import stochasticOscillator, { SMA } from 'trader/lib/stochasticOscillator'
import { CandleData } from 'shared/types'
import { execAgressiveBuy, execAgressiveSell } from 'shared/actions'

export default function* analyticsSaga() {
  let lastHigh = -1
  let lastLow = -1

  while (true) {
    const candles = yield select(selectCandles, 'trade:1m:tBTCUSD', 14)
    const [ upwardVertex, downwardVertex ] = vertexIndicator(candles)

    if (upwardVertex > Math.abs(downwardVertex)) debug('worker')('Положительная тенденция')
    if (upwardVertex < Math.abs(downwardVertex)) debug('worker')('Отрицательная тенденция')


    const ticker = yield select(selectTicker, 'BTCUSD')
    const [ bid, bidSize, ask, askSize, dailyChange, dailyChangePerc, lastPrice ] = ticker

    const lowestLow = yield select(selectLowestLow, 'trade:1m:tBTCUSD', 14)
    const highestHigh = yield select(selectHighestHigh, 'trade:1m:tBTCUSD', 14)

    const lastCandles = <CandleData[]>candles.slice(candles.length - 3, candles.length) // +3 candles ???
    const lastStochastics = lastCandles.map(candle => stochasticOscillator(candle[2], lowestLow, highestHigh))
    const currentStochastic = stochasticOscillator(lastPrice, lowestLow, highestHigh)

    const KStochastic = currentStochastic
    const DStochastic = SMA(lastStochastics)

    // debug('worker')(ticker)
    // debug('worker')(candles)
    // debug('worker')(lastCandles)
    // debug('worker')(lastStochastics)
    // debug('worker')({ lowestLow, highestHigh })
    debug('worker')([ upwardVertex, downwardVertex ])
    debug('worker')([ KStochastic, DStochastic ])

    if (
      KStochastic >= 80 &&
      DStochastic >= 80 &&
      KStochastic - DStochastic < 1 &&
      upwardVertex > 1 &&
      downwardVertex > -0.8
    ) {
      debug('worker')('Пик для продажи', bid)

      if (bid > lastHigh) {
        debug('worker')('Пробит максимум', bid)
        yield put(execAgressiveSell({ symbol: 'tBTCUSD', amount: -0.005, price: bid }))
      }

      lastHigh = bid
    }

    if (
      KStochastic <= 20 &&
      DStochastic <= 20 &&
      KStochastic - DStochastic < 1 &&
      upwardVertex < 0.8 &&
      downwardVertex < -1
    ) {
      debug('worker')('Дно для покупки', ask)

      if (ask < lastLow) {
        debug('worker')('Пробит минимум', ask)
        yield put(execAgressiveBuy({ symbol: 'tBTCUSD', amount: 0.005, price: ask }))
      }

      lastLow = ask
    }

    yield delay(5000)
  }
}
