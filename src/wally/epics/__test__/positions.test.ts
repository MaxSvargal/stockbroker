import { createEpicMiddleware } from 'redux-observable'
import configureMockStore from 'redux-mock-store'

import epic from '../index'

const epicMiddleware = createEpicMiddleware(epic)
const mockStore = configureMockStore([ epicMiddleware ])
const store = mockStore({ tickers: { tBTCUSD: { current: 'success' } } })

test('epic test', () => {
  store.dispatch({ type: 'SET_ACCOUNT' })
  expect(store.getActions()).toEqual([
    { type: 'SET_ACCOUNT' },
    { type: 'PING', payload: { symbol: 'tBTCUSD' } },
    { type: 'PONG', payload: 'success' }
  ])
})
