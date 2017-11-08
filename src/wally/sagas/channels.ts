import debug from 'debug'
import { all, call, take, fork, put } from 'redux-saga/effects'
import { eventChannel, delay, END, SagaIterator } from 'redux-saga'
import { BFX } from 'bitfinex-api-node'
import channelSaga from 'shared/sagas/bitfinexChannels'

import { setOrders, setWallet, updateWallet, newOrder, updateOrder, cancelOrder, updateMyTrade } from 'shared/actions'
import { WalletData, OrderData, MyTradeData } from 'shared/types'

export function* updateMyTradeChannelSaga(data: MyTradeData) {
  yield put(updateMyTrade(data))
}

export function* walletSnapshotChannelSaga(data: WalletData[]) {
  yield put(setWallet(data))
}

export function* walletUpdateChannelSaga(data: WalletData) {
  yield put(updateWallet(data))
}

export function* ordersSnapshotChannelSaga(data: OrderData[]) {
  yield put(setOrders(data))
}

export function* orderNewChannelSaga(data: OrderData) {
  yield put(newOrder(data))
}

export function* orderUpdateChannelSaga(data: OrderData) {
  yield put(updateOrder(data))
}

export function* orderCancelChannelSaga(data: OrderData) {
  yield put(cancelOrder(data))
}

export default function* runChannels(bws: BFX) {
  yield all([
    fork(channelSaga, bws, 'os', ordersSnapshotChannelSaga),
    fork(channelSaga, bws, 'on', orderNewChannelSaga),
    fork(channelSaga, bws, 'ou', orderUpdateChannelSaga),
    fork(channelSaga, bws, 'oc', orderCancelChannelSaga),
    fork(channelSaga, bws, 'ws', walletSnapshotChannelSaga),
    fork(channelSaga, bws, 'wu', walletUpdateChannelSaga),
    fork(channelSaga, bws, 'tu', updateMyTradeChannelSaga),
  ])
}
