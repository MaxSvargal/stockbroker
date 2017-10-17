import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, put, call, select } from 'redux-saga/effects'

import RPCSaga from 'shared/sagas/rpc'
import { execNewOrder, clearMACDResults } from 'shared/actions'
import { selectHighestBids, selectLowestAsks } from 'shared/sagas/selectors'
import analyticSaga from './analytic'
import getChunkAmount from './wallet'

const { PAIR } = process.env
const SYMBOL = `t${PAIR}`
if (!PAIR) throw Error('No pair or amount will passed by environment')

export function* doBuySaga(stoch: number) {
  const [ ask, reserveAsk ] = yield select(selectLowestAsks)
  const chunkAmount = yield call(getChunkAmount, SYMBOL, stoch)
  const amount = chunkAmount < 0.005 ? 0.005 : chunkAmount
  const price = ask[2] >= amount * 2 ? ask[0] : reserveAsk[0]

  yield put(execNewOrder({ symbol: SYMBOL, amount, price: price }))
  debug('worker')(`Exchange ${amount} for ${price} of ${PAIR}`)
}

export function* doSellSaga(stoch: number) {
  const [ bid, reserveBid ] = yield select(selectHighestBids)
  const chunkAmount = yield call(getChunkAmount, SYMBOL, stoch)
  const amount = chunkAmount < 0.005 ? 0.005 : chunkAmount
  const price = bid[2] >= amount * 2 ? bid[0] : reserveBid[0]

  yield put(execNewOrder({ symbol: SYMBOL, amount: -amount, price: price }))
  debug('worker')(`Exchange ${-amount} for ${price} of ${PAIR}`)
}

// TODO: refactor this
export function* requestOrder(execType: 'buy' | 'sell', stoch: number) {
  if (execType === 'sell') yield call(doSellSaga, stoch)
  else if (execType === 'buy') yield call(doBuySaga, stoch)
}

export function* analyticsSaga() {
  yield delay(3000)
  yield put(clearMACDResults({ symbol: SYMBOL }))

  while (true) {
    const { status, exec, stoch } = yield call(analyticSaga)
    if (status) yield fork(requestOrder, exec, stoch)
    yield delay(5000)
  }
}

export default function* rootSaga() {
  yield all([
    fork(analyticsSaga),
    // TODO: remove, move to redis pub-sub
    fork(RPCSaga)
  ])
}
