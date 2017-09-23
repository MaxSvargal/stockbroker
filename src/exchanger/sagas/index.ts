import { all, call } from 'redux-saga/effects'
import bitfinexSaga from './bitfinexSaga'

export default function* rootSaga() {
  yield all([
    call(bitfinexSaga)
  ])
}
