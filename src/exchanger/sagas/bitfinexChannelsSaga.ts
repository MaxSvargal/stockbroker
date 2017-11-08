import { all, call, take, fork, put } from 'redux-saga/effects'
import { eventChannel, delay, END, SagaIterator } from 'redux-saga'
import { BFX } from 'bitfinex-api-node'
import { OrderBookData, TradeData, WalletData, CandleData, TickerData, OrderData, MyTradeData, PAIR } from 'shared/types'
import debug from 'debug'
import * as actions from '../actions'
import { updateMyTrade } from 'shared/actions'

export const channel = (bws: BFX, name: string) => eventChannel(emitter => {
  bws.on(name, (...data: any[]) => emitter(data))
  bws.on('close', () => emitter(END))
  return () => bws.ws.close.bind(bws)
})

export function* channelSaga(bws: BFX, name: string, saga: (...data: any[]) => SagaIterator) {
  try {
    const chan = yield call(channel, bws, name)
    while (true) {
      const data = yield take(chan)
      yield fork(saga, ...data)
    }
  } catch (err) {
    debug('worker')('Channel closed', err)
  }
}

export function* orderBookChannelSaga(pair: PAIR, data: OrderBookData & OrderBookData[]) {
  if (Array.isArray(data[0]))
    yield put(actions.setOrderBook(data))
  else
    yield put(actions.updateOrderBook(data))
}

export function* tradeChannelSaga(pair: PAIR, data: [ string, TradeData ] & TradeData[]) {
  if (Array.isArray(data[0]))
    yield put(actions.setTrades({ pair, data }))
  else if (data[0] === 'tu')
    yield put(actions.addTrade({ pair, data: data[1] }))
}

export function* walletSnapshotChannelSaga(data: WalletData[]) {
  debug('worker')('SET WALLET', data)
  yield put(actions.setWallet(data))
}

export function* walletUpdateChannelSaga(data: WalletData) {
  console.log('updateWallet', data)
  yield put(actions.updateWallet(data))
}

export function* candlesChannelSaga(key: string, data: CandleData & CandleData[]) {
  // debug('worker')('CANDLES', data)
  if (Array.isArray(data[0]))
    yield put(actions.setCandles({ key, data }))
  else
    yield put(actions.updateCandle({ key, data }))
}

export function* tickerUpdateChannelSaga(pair: PAIR, data: TickerData) {
  yield put(actions.updateTicker({ pair, data }))
  // TODO
  // yield put(updateMyTrade([ new Date().getTime(), 'tBTCUSD', 1509967816000, 4904773502, 0.0073, 7000, 'EXCHANGE LIMIT', 7000, 1, -0.04681472, 'USD' ]))
  yield put(updateMyTrade([ new Date().getTime(), 'tBTCUSD', 1509967816000, 4904773502, -0.0073, 7100, 'EXCHANGE LIMIT', 7100, 1, -0.04681472, 'USD' ]))
}

export function* ordersSnapshotChannelSaga(data: OrderData[]) {
  yield put(actions.setOrders(data))
}

export function* orderNewChannelSaga(data: OrderData) {
  yield put(actions.newOrder(data))
}

export function* orderUpdateChannelSaga(data: OrderData) {
  yield put(actions.updateOrder(data))
}

export function* orderCancelChannelSaga(data: OrderData) {
  yield put(actions.cancelOrder(data))
}

export function* newMyTradeChannelSaga(data: MyTradeData) {
  yield put(updateMyTrade(data)) // TODO
  debug('worker')(data, 'newMyTradeChannelSaga')
}

export function* updateMyTradeChannelSaga(data: MyTradeData) {
  yield put(updateMyTrade(data))
  debug('worker')(data, 'updateMyTradeChannelSaga')
}

export default function* runChannels(bws: BFX) {
  yield all([
    // fork(channelSaga, bws, 'trades', tradeChannelSaga),
    fork(channelSaga, bws, 'ticker', tickerUpdateChannelSaga),
    fork(channelSaga, bws, 'orderbook', orderBookChannelSaga),
    fork(channelSaga, bws, 'candles', candlesChannelSaga),
    fork(channelSaga, bws, 'ws', walletSnapshotChannelSaga),
    fork(channelSaga, bws, 'wu', walletUpdateChannelSaga),
    fork(channelSaga, bws, 'os', ordersSnapshotChannelSaga),
    fork(channelSaga, bws, 'on', orderNewChannelSaga),
    fork(channelSaga, bws, 'ou', orderUpdateChannelSaga),
    fork(channelSaga, bws, 'oc', orderCancelChannelSaga),
    fork(channelSaga, bws, 'te', newMyTradeChannelSaga),
    fork(channelSaga, bws, 'tu', updateMyTradeChannelSaga),
  ])

  // bws.on('message', (msg: any) => console.log(msg))
  bws.on('ws', (msg: any) => console.log('WS', msg))
}
