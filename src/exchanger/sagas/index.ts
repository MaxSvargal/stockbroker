import { all, fork } from 'redux-saga/effects'
import { db } from 'exchanger'
import { watchForActions, publishActions } from 'shared/sagas/redisRPC'
import { updateMyTrade } from 'shared/actions'
import bitfinexSaga from './bitfinexSaga'

export default function* rootSaga() {
  const enabledProcedures = [ updateMyTrade ]

  yield all([
    fork(bitfinexSaga),
    fork(watchForActions, db),
    fork(publishActions, db, enabledProcedures)
  ])
}
