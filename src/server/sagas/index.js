import { fork } from 'redux-saga/effects'
// import poloniexPrivateSaga from './poloniex-private'
import poloniexPublicSaga from './poloniex-public'
import statsSaga from './stats'
import tradeSaga from './trade'
import walletSaga from './wallet'
import clientActions from './clientActions'

export default scServer => function* root() {
  yield [
    fork(clientActions, scServer),
    fork(poloniexPublicSaga),
    fork(statsSaga),
    fork(tradeSaga),
    fork(walletSaga)
  ]
}
