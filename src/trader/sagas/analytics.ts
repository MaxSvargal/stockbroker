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
  let lastDStochastic = -1

  while (true) {
    const candles = yield select(selectCandles, 'trade:1m:tBTCUSD', 14)
    const [ upwardVertex, downwardVertex ] = vertexIndicator(candles)

    const ticker = yield select(selectTicker, 'BTCUSD')
    const [ bid, bidSize, ask, askSize, dailyChange, dailyChangePerc, lastPrice ] = ticker

    const lowestLow = yield select(selectLowestLow, 'trade:1m:tBTCUSD', 14)
    const highestHigh = yield select(selectHighestHigh, 'trade:1m:tBTCUSD', 14)

    const lastCandles = <CandleData[]>candles.slice(candles.length - 3, candles.length) // +3 candles ???
    const lastStochastics = lastCandles.map(candle => stochasticOscillator(candle[2], lowestLow, highestHigh))
    const currentStochastic = stochasticOscillator(lastPrice, lowestLow, highestHigh)

    const KStochastic = currentStochastic
    const DStochastic = SMA(lastStochastics)

    debug('worker')({ lastPrice, bid, ask })
    // debug('worker')(candles)
    // debug('worker')(lastCandles)
    // debug('worker')(lastStochastics)
    // debug('worker')({ lowestLow, highestHigh })
    debug('worker')([ upwardVertex, downwardVertex ])
    debug('worker')([ KStochastic, DStochastic ])

    if (KStochastic >= 80 && DStochastic >= 80 && upwardVertex > Math.abs(downwardVertex)) {
      debug('worker')('Переоценено. Торгуем в стакане, продаём по', ask)
    }

    if (KStochastic <= 20 && DStochastic <= 20 && upwardVertex < Math.abs(downwardVertex)) {
      debug('worker')('Недооценено. Торгуем в стакане, покупаем по', bid)
    }

    if (DStochastic > 20 && lastDStochastic < 20) {
      debug('worker')('Стохастик индикатор подаёт сигнал к покупке', bid)
      yield put(execAgressiveBuy({ symbol: 'tBTCUSD', amount: 0.005, price: ask }))
    }

    if (DStochastic < 80 && lastDStochastic > 80) {
      debug('worker')('Стохастик индикатор подаёт сигнал к продаже', ask)
      yield put(execAgressiveSell({ symbol: 'tBTCUSD', amount: -0.005, price: bid }))
    }

    lastDStochastic = DStochastic

    // if (KStochastic >= 20 && DStochastic >= 20 && upwardVertex > Math.abs(downwardVertex)) {
    //   debug('worker')('Переоценено. Торгуем в стакане, покупаем по', ask)
    // }
    //
    // if (KStochastic <= 80 && DStochastic <= 80 && upwardVertex < Math.abs(downwardVertex)) {
    //   debug('worker')('Недооценено. Торгуем в стакане, продаём по', bid)
    // }

    // если значения на вертексе сильно разошлись, а потом развернулись - это подтверждающий сигнал

    // применять данные алгоритм только когда не торгуется в стакане
    if (
      KStochastic >= 80 &&
      DStochastic >= 80 &&
      KStochastic - DStochastic < 1 &&
      upwardVertex > 1
    ) {
      debug('worker')('Пик для продажи', bid)

      if (bid > lastHigh) {
        debug('worker')('Пробит максимум, ожидаем', bid)
      } else if (bid < lastHigh) {
        debug('worker')('Максимум достигнут, продаём', bid)
        // yield put(execAgressiveSell({ symbol: 'tBTCUSD', amount: -0.005, price: bid }))
      }

      lastHigh = bid
    }

    if (
      KStochastic <= 20 &&
      DStochastic <= 20 &&
      KStochastic - DStochastic < 1 &&
      downwardVertex < -1
    ) {
      debug('worker')('Дно для покупки', ask)

      if (ask < lastLow) {
        debug('worker')('Пробит минимум, ожидаем', ask)
      } else if (ask > lastLow) {
        // играть в стакане до индикации стохастика?
        debug('worker')('Минимум достигнут, покупаем', ask)
        // yield put(execAgressiveBuy({ symbol: 'tBTCUSD', amount: 0.005, price: ask }))
      }

      lastLow = ask
    }

    yield delay(5000)
  }
}
