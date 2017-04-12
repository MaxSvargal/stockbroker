import { fork } from 'redux-saga/effects'
import poloniexPublicSaga from './poloniex-public'
import statsSaga from './stats'
import walletSaga from './wallet'
import clientActions from './clientActions'
import chunksSaga from './chunks'

export default scServer => function* root() {
  yield [
    fork(walletSaga),
    fork(poloniexPublicSaga),
    fork(statsSaga),
    fork(chunksSaga),
    fork(clientActions, scServer)
  ]
}
