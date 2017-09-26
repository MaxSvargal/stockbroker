import { all, call, take, fork, put } from 'redux-saga/effects'
import { eventChannel, delay, END, SagaIterator } from 'redux-saga'
import { WS } from 'bitfinex-api-node'
import { OrderBookPayload, TradeData, WalletData, CandleData } from 'exchanger/actions'
import debug from 'debug'
import * as actions from '../actions'

type Pair = string

export const channel = (bws: WS, name: string) => eventChannel(emitter => {
  bws.on(name, (...data: any[]) => emitter(data))
  bws.on('close', () => emitter(END))
  return bws.close
})

// TODO https://github.com/redux-saga/redux-saga/issues/1177
export function* channelSaga(bws: WS, name: string, saga: any) {
  const chan = yield call(channel, bws, name)
  while (true) {
    const data = yield take(chan)
    yield fork(saga, ...data)
  }
}

export function* orderBookChannelSaga(pair: Pair, data: OrderBookPayload & OrderBookPayload[]) {
  if (Array.isArray(data[0]))
    yield put(actions.setOrderBook(data))
  else
    yield put(actions.updateOrderBook(data))
}

export function* tradeChannelSaga(pair: Pair, data: [ string, TradeData ] & TradeData[]) {
  if (Array.isArray(data[0]))
    yield put(actions.setTrades({ pair, data }))
  else if (data[0] === 'tu')
    yield put(actions.addTrade({ pair, data: data[1] }))
}

export function* walletSnapshotChannelSaga(data: WalletData[]) {
  yield put(actions.setWallet(data))
}

export function* walletUpdateChannelSaga(data: WalletData) {
  yield put(actions.updateWallet(data))
}

export function* candlesChannelSaga(key: string, data: CandleData & CandleData[]) {
  if (Array.isArray(data[0]))
    yield put(actions.setCandles({ key, data }))
  else
    yield put(actions.updateCandle({ key, data }))
}

export default function* runChannels(bws: WS) {
  yield all([
    // fork(channelSaga, bws, 'trades', tradeChannelSaga),
    fork(channelSaga, bws, 'book', orderBookChannelSaga),
    fork(channelSaga, bws, 'candles', candlesChannelSaga),
    fork(channelSaga, bws, 'ws', walletSnapshotChannelSaga),
    fork(channelSaga, bws, 'wu', walletUpdateChannelSaga)
  ])
}
