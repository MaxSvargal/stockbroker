import positionsReducer from '../positions'
import { createPosition } from 'shared/actions'

test('positionsReducer should open position correctly', () => {
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
  const action = createPosition(payload)

  expect(positionsReducer(state, action)).toEqual(expected)
})

test('positionsReducer should close position correctly', () => {
  const state = [
    {
      id: 1,
      symbol: 'tBTCUSD',
      mts: 1508841591508,
      cid: 37846,
      price: 6001.4,
      amount: 0.01
    }, {
      id: 2,
      symbol: 'tBTCUSD',
      mts: 1508841591508,
      cid: 37846,
      price: 6001.4,
      amount: 0.01
    }
  ]
  const expected = [
    {
      id: 1,
      symbol: 'tBTCUSD',
      mts: 1508841591508,
      cid: 37846,
      price: 6001.4,
      amount: 0.01
    }, {
      id: 2,
      symbol: 'tBTCUSD',
      mts: 1508841591508,
      cid: 37846,
      price: 6001.4,
      amount: 0.01
    }, {
      id: 3,
      symbol: 'tBTCUSD',
      mts: 1508841591508,
      cid: 37846,
      price: 6100,
      amount: -0.02,
      covered: [ 1, 2 ],
      profit: 0.001
    }
  ]

  const payload = {
    id: 3,
    symbol: 'tBTCUSD',
    mts: 1508841591508,
    cid: 37846,
    price: 6100,
    amount: -0.02,
    profit: 0.001,
    covered: [ 1, 2 ]
  }
  const action = createPosition(payload)

  expect(positionsReducer(state, action)).toEqual(expected)
})
