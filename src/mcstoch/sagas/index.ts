import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, put, call, select } from 'redux-saga/effects'

import RPCSaga from 'shared/sagas/rpc'
import { execNewOrder, clearMACDResults } from 'shared/actions'
import { selectHighestBids, selectLowestAsks } from 'shared/sagas/selectors'
import analyticSaga from './analytic'

const { PAIR, AMOUNT } = process.env
if (!PAIR) throw Error('No pair or amount will passed by environment')
const amount = Number(AMOUNT)
// TODO: calculate chunks
const SYMBOL = `t${PAIR}`

export function* doBuySaga() {
  const [ ask, reserveAsk ] = yield select(selectLowestAsks)
  const price = ask[2] >= amount ? ask[0] : reserveAsk[0]
  yield put(execNewOrder({ symbol: SYMBOL, amount, price: price }))
}

export function* doSellSaga() {
  const [ bid, reserveBid ] = yield select(selectHighestBids)
  const price = bid[2] >= amount ? bid[0] : reserveBid[0]
  yield put(execNewOrder({ symbol: SYMBOL, amount: -amount, price: price }))
}

// TODO: refactor this
export function* requestOrder(execType: 'buy' | 'sell') {
  if (execType === 'sell') yield call(doSellSaga)
  else if (execType === 'buy') yield call(doBuySaga)
}

export function* analyticsSaga() {
  yield delay(5000)
  yield put(clearMACDResults({ symbol: SYMBOL }))

  while (true) {
    const { status, exec } = yield call(analyticSaga)
    if (status) yield fork(requestOrder, exec)
    yield delay(10000)
  }
}

export default function* rootSaga() {
  yield all([
    fork(analyticsSaga),
    fork(RPCSaga)
  ])
}
