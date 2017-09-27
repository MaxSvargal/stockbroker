import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, select } from 'redux-saga/effects'
import { selectCandles, selectTicker, selectLowestLow, selectHighestHigh } from './selectors'
import vertexIndicator from 'trader/lib/vertexIndicator'
import stochasticOscillator, { SMA } from 'trader/lib/stochasticOscillator'
import { CandleData } from 'shared/types'

function* vertex() {
  let prevVertexResults: number[] = [ 0, 0 ]
  while (true) {
    const candles = yield select(selectCandles, 'trade:1m:tBTCUSD', 14)
    const vertexResults = vertexIndicator(candles)
    // vertexResults[0] === vertexResults[1] change!
    if (prevVertexResults[0] < vertexResults[0]) debug('worker')('Быки крепнут')
    else if (prevVertexResults[0] > vertexResults[0]) debug('worker')('Быки слабеют')

    if (prevVertexResults[1] > vertexResults[1]) debug('worker')('Медведи крепнут')
    else if (prevVertexResults[1] < vertexResults[1]) debug('worker')('Медведи слабеют')

    if (vertexResults[0] > Math.abs(vertexResults[1])) debug('worker')('Положительная тенденция')
    if (vertexResults[0] < Math.abs(vertexResults[1])) debug('worker')('Отрицательная тенденция')

    prevVertexResults = vertexResults

    const ticker = yield select(selectTicker, 'BTCUSD')
    const current = ticker[6]
    const lowestLow = yield select(selectLowestLow, 'trade:1m:tBTCUSD', 14)
    const highestHigh = yield select(selectHighestHigh, 'trade:1m:tBTCUSD', 14)

    const lastCandles = <CandleData[]>candles.slice(candles.length - 3, candles.length) // +3 candles ???
    const lastStochastics = lastCandles.map(candle => stochasticOscillator(candle[2], lowestLow, highestHigh))
    const currentStochastic = stochasticOscillator(current, lowestLow, highestHigh)

    const KStochastic = currentStochastic
    const DStochastic = SMA(lastStochastics)

    // debug('worker')(candles)
    // debug('worker')(lastCandles)
    // debug('worker')(lastStochastics)
    // debug('worker')({ lowestLow, highestHigh })
    debug('worker')(vertexResults)
    debug('worker')([ KStochastic, DStochastic ])

    yield delay(5000)
  }
}

export default function* rootSaga() {
  yield all([ fork(vertex) ])
}
