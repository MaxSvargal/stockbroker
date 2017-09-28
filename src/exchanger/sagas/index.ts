import { all, fork } from 'redux-saga/effects'
import bitfinexSaga from './bitfinexSaga'
import crossbarSaga from './crossbarSaga'

export default function* rootSaga() {
  yield all([
    fork(bitfinexSaga),
    fork(crossbarSaga)
  ])
}
