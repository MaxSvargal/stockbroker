import debug from 'debug'
import { delay, SagaIterator } from 'redux-saga'
import { all, fork, put, call } from 'redux-saga/effects'

import { publishActions } from 'shared/sagas/redisRPC'
import { execNewOrder, clearMACDResults } from 'shared/actions'

import analyticSaga from './analytic'
import { doSellSaga, doBuySaga, getChunkAmount } from './wallet'
import store from '../index'

const { PAIR } = process.env
const symbol = `t${PAIR}`
if (!PAIR) throw Error('No pair or amount will passed by environment')

// TODO: refactor this
export function* requestOrder(execType: 'buy' | 'sell', stoch: number) {
  if (execType === 'sell') yield call(doSellSaga, symbol, stoch)
  else if (execType === 'buy') yield call(doBuySaga, symbol, stoch)
}

export function* analyticsSaga() {
  yield delay(3000)
  yield put(clearMACDResults({ symbol }))

  while (true) {
    const { status, exec, stoch } = yield call(analyticSaga)
    if (status) yield fork(requestOrder, exec, stoch)
    yield delay(5000)
  }
}

export default function* rootSaga(): SagaIterator {
  const enabledProcedures = [ execNewOrder ]
  yield all([
    fork(analyticsSaga),
    fork(publishActions, store.db, enabledProcedures)
  ])
}
