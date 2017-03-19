import { fork } from 'redux-saga/effects'
import poloniexPrivateSaga from './poloniex-private'
import poloniexPublicSaga from './poloniex-public'
import tradeSaga from './trade'

export default function* root() {
  yield [
    // fork(poloniexPrivateSaga),
    fork(poloniexPublicSaga),
    fork(tradeSaga)
  ]
}
