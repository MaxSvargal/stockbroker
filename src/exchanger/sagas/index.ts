import { all, fork } from 'redux-saga/effects'
import { db } from 'exchanger'
import { watchForActions } from 'shared/sagas/redisRPC'
import bitfinexSaga from './bitfinexSaga'

export default function* rootSaga() {
  yield all([
    fork(bitfinexSaga),
    fork(watchForActions, db)
  ])
}
