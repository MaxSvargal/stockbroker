import { TestScheduler, Observable } from 'rxjs'
import { createEpicMiddleware, ActionsObservable } from 'redux-observable'
import configureStore from 'redux-mock-store'

import { Action } from 'shared/types'
import { bitfinexConnected, orderUpdate, updateMyTrade, createPosition, signalRequest, signalRequestResolved, signalRequestRejected } from 'shared/actions'
import { connect, newOrder, newOrderRequest } from '../bitfinex'

const mockStore = configureStore()

export const createTestScheduler = () =>
  new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected))

export function testAction<A>
  (testScheduler: TestScheduler, marbles: string, values?: any) {
    return new ActionsObservable<Action>(testScheduler.createHotObservable(marbles, values)) }

export const run = (epicFn: Function, state: {}, inputMarble: string, ouputMarble: string, inputActions: {}, outputActions: {}) => {
  const testScheduler = createTestScheduler()
  const action$ = testAction<Action>(testScheduler, inputMarble, inputActions)
  const store = mockStore(state)
  const outputAction$ = epicFn(action$, store)
  testScheduler.expectObservable(outputAction$).toBe(ouputMarble, outputActions)
  testScheduler.flush()
}

const ws = { send: (msg: Action) => undefined }

test('Bifinex connect should open connection', () => {
  run(
    newOrder,
    {},
    '-a-b-c-d------z',
    '--------------a',
    {
      a: bitfinexConnected(ws),
      // b: signalRequestResolved({ amount: 1, price: 100, symbol: 'tBTCUSD' }),
      b: signalRequestResolved({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta', meta: { status: true, amount: 1, price: 100 } }),
      c: orderUpdate([ 5147511788, 'tBTCETH', 1, 1, 'EXCHANGE LIMIT', 'ACTIVE', 10, 0, '2017-11-15T19:08:50Z', 0, 0, 0 ]),
      d: orderUpdate([ 5147511788, 'tBTCUSD', 1, 1, 'EXCHANGE LIMIT', 'ACTIVE', 100, 0, '2017-11-15T19:08:50Z', 0, 0, 0 ]),
      z: updateMyTrade([ '3014956-BCHUSD', 93168682, 'BCHUSD', 1510773013, 5147511788, 0.1, 1236, 'EXCHANGE LIMIT', 1236, -0.1065432, 'USD' ])
    },
    {
      a: createPosition([ '3014956-BCHUSD', 93168682, 'BCHUSD', 1510773013, 5147511788, 0.1, 1236, 'EXCHANGE LIMIT', 1236, -0.1065432, 'USD' ])
      // a: createPosition({ symbol: 'tBTCUSD', id: 0, mts: 0, price: 1236, amount: 0.1 })
    }
  )
})

test('newOrderRequest should approve when funds avaliable', () => {
  run(
    newOrderRequest,
    {
      maxChunksNumber: 4,
      minChunkAmount: 0.5,
      minThreshold: 0.01,
      wallet: { exchange: { BTC: { balance: 2.98 }, USD: { balance: 100 } } },
      bids: {
        99: [ 99, 1, 20 ],
        100: [ 100, 1, 30 ],
        98: [ 98, 1, 10 ]
      },
      positions: [
        { symbol: 'tBTCUSD', id: 100500, mts: 1511020433555, price: 70, amount: 1 },
        { symbol: 'tBTCUSD', id: 100501, mts: 1511020433556, price: 110, amount: 1 },
        { symbol: 'tBTCUSD', id: 100502, mts: 1511020433557, price: 120, amount: 1 }
      ]
    },
    '-a-b',
    '-a-b',
    {
      a: signalRequest({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta' }),
      b: signalRequest({ type: 'sell', symbol: 'tBTCUSD', from: 'mcrasta' })
    },
    {
      a: signalRequestResolved({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta', meta: { status: true, amount: 0.98, price: 100 } }),
      b: signalRequestResolved({ type: 'sell', symbol: 'tBTCUSD', from: 'mcrasta', meta: { status: true, amount: 1, price: 100, covered: [ 100500 ] } })
    }
  )
})

test('newOrderRequest should reject when no funds avaliable', () => {
  run(
    newOrderRequest,
    {
      maxChunksNumber: 4,
      minChunkAmount: 0.5,
      minThreshold: 0.1,
      wallet: { exchange: { BTC: { balance: 2.9 }, USD: { balance: 10 } } },
      bids: {
        99: [ 99, 1, 20 ],
        100: [ 100, 1, 30 ],
        98: [ 98, 1, 10 ]
      },
      positions: [
        { symbol: 'tBTCUSD', id: 100500, mts: 1511020433555, price: 100, amount: 1 }
      ]
    },
    '-a-b',
    '-a-b',
    {
      a: signalRequest({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta' }),
      b: signalRequest({ type: 'sell', symbol: 'tBTCUSD', from: 'mcrasta' })
    },
    {
      a: signalRequestRejected({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta', meta: { status: false, reason: 'No funds avaliable' } }),
      b: signalRequestRejected({ type: 'sell', symbol: 'tBTCUSD', from: 'mcrasta', meta: { status: false, reason: 'No position to cover' } })
    }
  )
})
