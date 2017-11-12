import { createEpicMiddleware } from 'redux-observable'
import configureMockStore from 'redux-mock-store'

import { bitfinexConnect, bitfinexConnected } from 'shared/actions'

import connect from '../bitfinex'

const epicMiddleware = createEpicMiddleware(connect)
const mockStore = configureMockStore([ epicMiddleware ])

test('Bifinex connect should open connection', async () => {
  const store = mockStore()
  store.dispatch(bitfinexConnect())

  await expect(store.getActions()).toEqual([
    bitfinexConnect(),
    bitfinexConnected({ ws: 'ws' })
  ])
})
