import { fork } from 'redux-saga/effects'
import poloniexPublicSaga from './poloniexPublic'
import statsSaga from './stats'
import walletSaga from './wallet'
import clientActions from './clientActions'
import chunksSaga from './chunks'

export default function* root() {
  yield [
    fork(walletSaga),
    fork(poloniexPublicSaga),
    fork(statsSaga),
    fork(chunksSaga),
    fork(clientActions)
  ]
}
