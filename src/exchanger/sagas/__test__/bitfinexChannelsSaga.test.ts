import { expectSaga } from 'redux-saga-test-plan'

import { setTrades } from '../../actions'
import tradesReducer from '../../reducers/trades'
import orderBookReducer from '../../reducers/orderbook'
import { tradeChannelSaga, orderBookChannelSaga } from '../bitfinexChannelsSaga'

test('tradeChannelSaga should store snapshot correctly', () => {
  const args = [ 'tBTCUSD', [
    [ 69345500, 1506028430000, -0.1, 3662.6 ],
    [ 69345479, 1506028428000, -0.11852904, 3662.5 ]
  ] ]

  return expectSaga(tradeChannelSaga, ...args)
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

  return expectSaga(tradeChannelSaga, ...args)
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

  return expectSaga(orderBookChannelSaga, ...args)
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

test('orderBookChannelSaga should store update correctly', () => {
  const args = [ 'tBTCUSD', [ 3666.2, 1, 1 ] ]

  return expectSaga(orderBookChannelSaga, ...args)
    .withReducer(orderBookReducer)
    .hasFinalState({
      bid: {
        '3666.2': [ 3666.2, 1, 1 ]
      },
      ask: {}
    })
    .run()
})
