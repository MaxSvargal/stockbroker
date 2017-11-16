import { createEpicMiddleware, ActionsObservable } from 'redux-observable'
import configureMockStore from 'redux-mock-store'

import { bitfinexConnected, execNewOrder, orderUpdate, updateMyTrade, createPosition } from 'shared/actions'

import { connect, newOrder } from '../bitfinex'

import { TestScheduler, Observable } from 'rxjs'

const epicMiddleware = createEpicMiddleware(connect)
const mockStore = configureMockStore([ epicMiddleware ])

export const createTestScheduler = () =>
  new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected))

export function createTestAction$FromMarbles<A>
  (testScheduler: TestScheduler, marbles: string, values?: any) {
    return new ActionsObservable<Action>(testScheduler.createHotObservable(marbles, values)) }

const ws = { send: (msg: Action) => msg }

test('Bifinex connect should open connection', () => {
  const inputMarble = '-a-b-c-d-'
  const outputMarble = '-------a'
  const inputActions = {
    a: bitfinexConnected(ws),
    b: execNewOrder({ amount: 1, price: 100, symbol: 'tBTCUSD' }),
    c: orderUpdate([ 5147511788, 'BTCUSD', 0.1, 0.1, 'EXCHANGE LIMIT', 'ACTIVE', 1236, 0, '2017-11-15T19:08:50Z', 0, 0, 0 ]),
    d: updateMyTrade([ '3014956-BCHUSD', 93168682, 'BCHUSD', 1510773013, 5147511788, 0.1, 1236, 'EXCHANGE LIMIT', 1236, -0.1065432, 'USD' ])
  }
  const outputActions = {
    a: createPosition([ '3014956-BCHUSD', 93168682, 'BCHUSD', 1510773013, 5147511788, 0.1, 1236, 'EXCHANGE LIMIT', 1236, -0.1065432, 'USD' ])
    // a: createPosition({ symbol: 'tBTCUSD', id: 0, mts: 0, price: 1236, amount: 0.1 })
  }

  const testScheduler = createTestScheduler()
  const action$ = createTestAction$FromMarbles<Action>(testScheduler, inputMarble, inputActions)
  const outputAction$ = newOrder(action$)

  testScheduler.expectObservable(outputAction$).toBe(outputMarble, outputActions)
  testScheduler.flush()
})
