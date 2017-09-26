import { expectSaga } from 'redux-saga-test-plan'

import tradesReducer from 'shared/reducers/trades'
import orderBookReducer from 'shared/reducers/orderbook'
import candlesReducer from 'shared/reducers/candles'
import walletReducer from 'shared/reducers/wallet'
import * as channelsSagas from '../bitfinexChannelsSaga'

test('tradeChannelSaga should store snapshot correctly', () => {
  const args = [ 'tBTCUSD', [
    [ 69345500, 1506028430000, -0.1, 3662.6 ],
    [ 69345479, 1506028428000, -0.11852904, 3662.5 ]
  ] ]

  return expectSaga(channelsSagas.tradeChannelSaga, ...args)
    .withReducer(tradesReducer)
    .hasFinalState({
      tBTCUSD: {
        69345500: [ 1506028430000, -0.1, 3662.6 ],
        69345479: [ 1506028428000, -0.11852904, 3662.5 ]
      }
    })
    .run()
})

test('tradeChannelSaga should store update correctly', () => {
  const args = [ 'tBTCUSD', [ 'tu', [ 69345500, 1506028430000, -0.1, 3662.6 ] ] ]

  return expectSaga(channelsSagas.tradeChannelSaga, ...args)
    .withReducer(tradesReducer)
    .hasFinalState({
      tBTCUSD: {
        69345500: [ 1506028430000, -0.1, 3662.6 ]
      }
    })
    .run()
})

test('orderBookChannelSaga should store snapshot correctly', () => {
  const args = [ 'tBTCUSD', [ [ 3660.2, 1, 1.9978 ], [ 3660, 2, 0.50199077 ] ] ]

  return expectSaga(channelsSagas.orderBookChannelSaga, ...args)
    .withReducer(orderBookReducer)
    .hasFinalState({
      bid: {
        '3660.2': [ 3660.2, 1, 1.9978 ],
        '3660': [ 3660, 2, 0.50199077 ]
      },
      ask: {}
    })
    .run()
})

test('candlesChannelSaga should store snapshot correctly', () => {
  const args = [ 'trade:1m:tBTCUSD', [
    [ 1506451620000, 3900, 3900.1, 3900.3, 3900, 12.11782279 ],
    [ 1506451560000, 3900.5, 3900.6, 3901.1, 3900.2, 4.50741425 ]
  ] ]

  return expectSaga(channelsSagas.candlesChannelSaga, ...args)
    .withReducer(candlesReducer)
    .hasFinalState({
      'trade:1m:tBTCUSD': {
        1506451620000: [ 3900, 3900.1, 3900.3, 3900, 12.11782279 ],
        1506451560000: [ 3900.5, 3900.6, 3901.1, 3900.2, 4.50741425 ]
      }
    })
    .run()
})

test('candlesChannelSaga should update correctly', () => {
  const initialState = { 'trade:1m:tBTCUSD': { 1506451620000: [ 0, 0, 0, 0, 0 ] } }
  const args = [ 'trade:1m:tBTCUSD', [ [ 1506451620000, 3900, 3900.1, 3900.3, 3900, 12.11782279 ] ] ]

  return expectSaga(channelsSagas.candlesChannelSaga, ...args)
    .withReducer(candlesReducer, initialState)
    .hasFinalState({
      'trade:1m:tBTCUSD': {
        1506451620000: [ 3900, 3900.1, 3900.3, 3900, 12.11782279 ]
      }
    })
    .run()
})

test('walletSnapshotChannelSaga should store snapshot correctly', () => {
  const args = [
    [
      [ 'exchange', 'BTC', 0.18193351, 0, null ],
      [ 'exchange', 'USD', 58.42533296, 0, null ]
    ]
  ]

  return expectSaga(channelsSagas.walletSnapshotChannelSaga, ...args)
    .withReducer(walletReducer)
    .hasFinalState({
      exchange: {
        BTC: { balance: 0.18193351, unsettledInterest: 0, balanceAvaliable: null },
        USD: { balance: 58.42533296, unsettledInterest: 0, balanceAvaliable: null }
      }
    })
    .run()
})

test('walletUpdateChannelSaga should store snapshot correctly', () => {
  const initialState = { exchange: { BTC: { balance: 0 } } }
  const args = [ [ 'exchange', 'BTC', 0.18193351, 0, null ] ]

  return expectSaga(channelsSagas.walletUpdateChannelSaga, ...args)
    .withReducer(walletReducer)
    .hasFinalState({
      exchange: {
        BTC: { balance: 0.18193351, unsettledInterest: 0, balanceAvaliable: null }
      }
    })
    .run()
})
