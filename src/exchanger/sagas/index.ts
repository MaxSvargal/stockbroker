import { all, fork } from 'redux-saga/effects'
import { db } from 'exchanger'
import { watchForActions, publishActions } from 'shared/sagas/redisRPC'
import { updateMyTrade, execNewOrder } from 'shared/actions'
import bitfinexSaga from './bitfinexSaga'

export default function* rootSaga() {
  const enabledPublishProcedures = [ updateMyTrade ]
  const enabledSubscribeProcedures = [ execNewOrder ]

  yield all([
    fork(bitfinexSaga),
    fork(watchForActions, db, enabledSubscribeProcedures),
    fork(publishActions, db, enabledPublishProcedures)
  ])
}
