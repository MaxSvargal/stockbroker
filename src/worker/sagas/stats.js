import debug from 'debug'
import { select, put, fork, take, throttle } from 'redux-saga/effects'
import { setCurrency, addStats, addMessage } from '../../shared/actions'
import { cropNumber } from '../../shared/utils'
import { selectBuysDuringTime, selectSellsDuringTime, selectCurrencyProps, selectCurrentTime, selectLastStat } from './selectors'

const getRateChange = arr => {
  const dyns = arr.map(i => i[1]).reduce((prev, curr, index) =>
    index === 1 ?
      [ curr, [] ] :
      [ curr, [ ...prev[1], curr / prev[0] ] ])[1]

  const genDyn = dyns.reduce((a, b) => a + b) / dyns.length
  const relProf = (genDyn * 100) - 100
  return relProf
}

export function* generateStatsSaga() {
  const lastStat = yield select(selectLastStat)

  const buys = yield select(selectBuysDuringTime, lastStat ? lastStat.created : 0)
  const sells = yield select(selectSellsDuringTime, lastStat ? lastStat.created : 0)
  if (buys.length < 4 || sells.length < 4) return

  const buyChange = cropNumber(getRateChange(buys))
  const sellChange = cropNumber(getRateChange(sells))

  const { last, lowestAsk, highestBid } = yield select(selectCurrencyProps)
  const created = yield select(selectCurrentTime)

  yield put(addStats({ created, last, lowestAsk, highestBid, buyChange, sellChange }))
}

export function* logMessagesSaga() {
  while (true) {
    const { payload } = yield take(addMessage)
    debug('worker')(payload)
  }
}

export default function* StatsSaga() {
  yield throttle(5000, setCurrency, generateStatsSaga)
  yield fork(logMessagesSaga)
}
