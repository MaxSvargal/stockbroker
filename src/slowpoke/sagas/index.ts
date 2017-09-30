import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, put, select } from 'redux-saga/effects'
import RPCSaga from 'shared/sagas/rpc'
import { execNewOrder } from 'shared/actions'
import { selectCandles, selectTicker, selectLowestLow, selectHighestHigh } from 'shared/sagas/selectors'
import stochasticOscillator, { SMA } from 'shared/lib/stochasticOscillator'
import { CandleData } from 'shared/types'

const { ACCOUNT, PAIR, AMOUNT } = process.env
if (!PAIR || !AMOUNT) throw Error('No pair or amount will passed by environment')
const amount = Number(AMOUNT)

export function* analyticsSaga() {
  let lastDStochastic
  while (true) {
    const candlesKey = `trade:5m:t${PAIR}`
    const candles = yield select(selectCandles, candlesKey, 14)
    const lowestLow = yield select(selectLowestLow, candlesKey, 14)
    const highestHigh = yield select(selectHighestHigh, candlesKey, 14)
    const ticker = yield select(selectTicker, PAIR)

    const lastCandles = <CandleData[]>candles.slice(candles.length - 4, candles.length - 1)
    const [ bid, bidSize, ask, askSize, dailyChange, dailyChangePerc, lastPrice ] = ticker
    const lastStochastics = lastCandles.map(candle => stochasticOscillator(candle[2], lowestLow, highestHigh))
    const DStochastic = SMA(lastStochastics)

    debug('worker')({ ACCOUNT, PAIR, DStochastic })

    if (lastDStochastic && lastDStochastic > 80 && DStochastic < 80) {
      debug('worker')('Stochastic signal to sell by', bid)
      yield put(execNewOrder({ symbol: `t${PAIR}`, amount: -amount, price: bid }))
    }

    if (lastDStochastic && lastDStochastic < 20 && DStochastic > 20) {
      debug('worker')('Stochastic signal to buy by', ask)
      yield put(execNewOrder({ symbol: `t${PAIR}`, amount: amount, price: ask }))
    }

    lastDStochastic = DStochastic

    yield delay(5000)
  }
}

export default function* rootSaga() {
  yield all([
    fork(analyticsSaga),
    fork(RPCSaga)
  ])
}
