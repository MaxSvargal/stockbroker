import { all, fork } from 'redux-saga/effects'
import poloniexPublicSaga from './poloniexPublic'
import statsSaga from './stats'
import walletSaga from './wallet'
import clientActions from './clientActions'
import chunksSaga from './chunks'
import decisionsSaga from './decisions'

export default function* root() {
  yield all([
    fork(walletSaga),
    fork(poloniexPublicSaga),
    fork(statsSaga),
    fork(chunksSaga),
    fork(clientActions),
    fork(decisionsSaga)
  ])
}
