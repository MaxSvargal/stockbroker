import positionsReducer from '../positions'
import { openPosition, closePosition } from 'shared/actions'

test('positionsReducer should add correctly', () => {
  const payload = {
    id: 1,
    symbol: 'tBTCUSD',
    mts: 1508841591508,
    cid: 37846,
    price: 6001.4,
    amount: 0.01,
    isSell: false
  }
  const state = [ payload ]
  const expected = [ payload, payload ]
  const action = openPosition(payload)
  expect(positionsReducer(state, action)).toEqual(expected)
})
