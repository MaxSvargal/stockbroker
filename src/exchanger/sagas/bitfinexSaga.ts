import debug from 'debug'
import { all, call, take, fork, put } from 'redux-saga/effects'
import { eventChannel, delay, END } from 'redux-saga'

import bitfinexService from '../services/bitfinexService'
import * as actions from '../actions'

const bitfinexedPair = process.env.CURRENCY_PAIR.replace('_', '')

export const bitfinexChannel = (bws, channel) => eventChannel(emitter => {
  bws.on(channel, (...data) => emitter(data))
  bws.on('close', () => emitter(END))
  return bws.close
})

export function* orderBookChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'orderbook')
  while (true) {
    const [ , data ] = yield take(chan)
    if (Array.isArray(data[0]))
      yield put(actions.setOrderBook(data))
    else
      yield put(actions.updateOrderBook(data))
  }
}

export function* tradeChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'trade')
  while (true) {
    const [ pair, [ type, trade ] ] = yield take(chan)
    if (type === 'tu') yield put(actions.newTrade({ pair, trade }))
  }
}

export function* tickerChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'ticker')
  while (true) {
    const [ , data ] = yield take(chan)
    yield put(actions.setCurrency(data))
  }
}

export function* walletSnapshotChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'ws')
  while (true) {
    const [ wallet ] = yield take(chan)
    yield put(actions.setWallet(wallet))
  }
}

export function* walletUpdateChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'wu')
  while (true) {
    const [ wallet ] = yield take(chan)
    yield put(actions.updateWallet(wallet))
  }
}

export function* tradeExecuteChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'tu') // +te?
  while (true) {
    const [ trade ] = yield take(chan)
    yield put(actions.tradeExecute(trade))
  }
}

export function* orderSnapshotChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'hos')
  while (true) {
    const [ orders ] = yield take(chan)
    yield put(actions.setOrders(orders))
  }
}

export function* newOrderChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'on')
  while (true) {
    const [ order ] = yield take(chan)
    debug('worker')('open order #', order[0])
    yield put(actions.newOrder(order))
  }
}

export function* updateOrderChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'ou')
  while (true) {
    const [ order ] = yield take(chan)
    debug('worker')('update order #', order[0])
    yield put(actions.updateOrder(order))
  }
}

export function* cancelOrderChannelSaga(bws) {
  const chan = yield call(bitfinexChannel, bws, 'oc')
  while (true) {
    const [ order ] = yield take(chan)
    debug('worker')('cancel order #', order[0])
    yield put(actions.cancelOrder(order))
  }
}

export function* watchCreateOrderSaga(bws) {
  while (true) {
    const { payload: { amount, price } } = yield take(actions.createOrder)
    const order = [ 0, 'on', null, {
      gid: 1,
      cid: null,
      type: 'EXCHANGE LIMIT',
      symbol: `t${bitfinexedPair}`,
      amount: `${amount}`,
      price: `${price}`,
      hidden: 0
    } ]
    yield call([ bws, 'send' ], order)
  }
}

export function* watchCancelOrderSaga(bws) {
  while (true) {
    const { payload: { id } } = yield take(actions.makeCancelOrder)
    const req = [ 0, 'oc', null, { id } ]
    yield call([ bws, 'send' ], req)
  }
}

export default function* bitfinexSaga() {
  try {
    debug('worker')('Connect to bitfinex...')
    const bws = yield call(bitfinexService)

    yield all([
      fork(cancelOrderChannelSaga, bws),
      fork(newOrderChannelSaga, bws),
      fork(orderBookChannelSaga, bws),
      fork(orderSnapshotChannelSaga, bws),
      fork(tickerChannelSaga, bws),
      fork(tradeExecuteChannelSaga, bws),
      fork(tradeChannelSaga, bws),
      fork(updateOrderChannelSaga, bws),
      fork(walletSnapshotChannelSaga, bws),
      fork(walletUpdateChannelSaga, bws),
      fork(watchCancelOrderSaga, bws),
      fork(watchCreateOrderSaga, bws)
    ])

    bws.subscribeTrades(bitfinexedPair)
    bws.subscribeOrderBook(bitfinexedPair)
    bws.subscribeTicker(bitfinexedPair)

    // bws.on('message', console.log)
    bws.on('error', () => console.log)
    bws.on('close', () => console.log)

    debug('worker')('Connection to bitfinex socket established')
    debug('worker')('Listen pair', bitfinexedPair)
  } catch (err) {
    debug('worker')('Connection to bitfinex failed with error: ', err)
    yield delay(10000)
    yield fork(bitfinexSaga)
  }
}
