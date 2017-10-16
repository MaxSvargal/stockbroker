import debug from 'debug'
import { delay } from 'redux-saga'
import { all, fork, put, call, select } from 'redux-saga/effects'

import RPCSaga from 'shared/sagas/rpc'
import { execNewOrder, clearMACDResults } from 'shared/actions'
import { selectHighestBids, selectLowestAsks } from 'shared/sagas/selectors'
import analyticSaga from './analytic'

const { PAIR } = process.env
if (!PAIR) throw Error('No pair or amount will passed by environment')
// const AMOUNT = Number(AMOUNT)
// TODO: calculate chunks
const AMOUNT = 0.005
const SYMBOL = `t${PAIR}`

export function* doBuySaga() {
  const [ ask, reserveAsk ] = yield select(selectLowestAsks)
  const price = ask[2] >= AMOUNT ? ask[0] : reserveAsk[0]
  // yield put(execNewOrder({ symbol: SYMBOL, amount: AMOUNT, price: price }))
}

export function* doSellSaga() {
  const [ bid, reserveBid ] = yield select(selectHighestBids)
  const price = bid[2] >= AMOUNT ? bid[0] : reserveBid[0]
  // yield put(execNewOrder({ symbol: SYMBOL, amount: -AMOUNT, price: price }))
}

export function* requestOrder(execType: 'buy' | 'sell') {
  yield select(selectHighestBids)
}

export function* analyticsSaga() {
  yield put(clearMACDResults({ symbol: SYMBOL }))
  yield delay(5000)

  while (true) {
    const { status, exec } = yield call(analyticSaga)
    if (status) yield fork(requestOrder, exec)
    yield delay(5000)
  }
}

export default function* rootSaga() {
  yield all([
    fork(analyticsSaga),
    fork(RPCSaga)
  ])
}
