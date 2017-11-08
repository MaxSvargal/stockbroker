import { selectLastRVIResults, selectActivePositions, selectLowestLow, selectHighestBid, selectMeansToBuy, selectLowestAsk } from '../selectors'

// test('selectLowestLow should work correctly', () => {
//   const state = {
//     candles: {
//       tBTCUSD: [
//         []
//       ]
//     }
//   }
//   expect(selectLowestLow(state))
// })

test('selectLastRVIResult should work correctly', () => {
  expect(selectLastRVIResults({ rvi: {} }, 'tBTCUSD', 1)).toEqual([])
  expect(selectLastRVIResults({ rvi: { tBTCUSD: [ 1, 2 ] } }, 'tBTCUSD', 1)).toEqual([ 2 ])
})

test('selectActivePositions sould work correctly', () => {
  const state = {
    positions: [
      {
        id: 1,
        symbol: 'tBTCUSD',
        mts: 1508841591508,
        cid: 37846,
        price: 6001.4,
        amount: 0.01
      },
      {
        id: 2,
        symbol: 'tBTCUSD',
        mts: 1508841591508,
        cid: 37846,
        price: 6001.4,
        amount: 0.01
      },
      {
        id: 3,
        symbol: 'tBTCUSD',
        mts: 1508841591508,
        cid: 37846,
        price: 6001.4,
        amount: 0.01
      },
      {
        id: 4,
        symbol: 'tBTCUSD',
        mts: 1508841591508,
        cid: 37846,
        price: 6001.4,
        amount: 0.01
      },
      {
        id: 5,
        symbol: 'tBTCUSD',
        mts: 1508841591508,
        cid: 37846,
        price: 6001.4,
        amount: -0.01,
        covered: [ 1, 3 ],
        profit: 0.002
      },
      {
        id: 6,
        symbol: 'tBTCUSD',
        mts: 1508841591508,
        cid: 37846,
        price: 6001.4,
        amount: -0.01,
        covered: [ 2 ],
        profit: 0.002
      }
    ]
  }
  const expected = [
    {
      id: 4,
      symbol: 'tBTCUSD',
      mts: 1508841591508,
      cid: 37846,
      price: 6001.4,
      amount: 0.01
    }
  ]
  expect(selectActivePositions(state, 'tBTCUSD')).toEqual(expected)
})

test('selectActivePositions should return empty array on initial', () => {
  const state = { positions: [] }
  const expected = []
  expect(selectActivePositions(state, 'tBTCUSD')).toEqual(expected)
})

test('selectHighestBid should work correctly', () => {
  const state = {
    bids: {
      [100]: [ 100, 1, 1 ],
      [101]: [ 101, 1, 1 ],
      [102]: [ 102, 1, 1 ]
    }
  }
  expect(selectHighestBid(state)).toEqual([ 102, 1, 1 ])
})

test('selectLowestAsk should work correctly', () => {
  const state = {
    bids: {
      [101]: [ 101, 1, 1 ],
      [100]: [ 100, 1, 1 ],
      [102]: [ 102, 1, 1 ]
    }
  }
  expect(selectLowestAsk(state)).toEqual([ 100, 1, 1 ])
})

test('selectMeansToBuy shoult work correctly', () => {
  const state = {
    wallet: {
      exchange: {
        BTC: {
          balance: 0.1
        },
        USD: {
          balance: 100
        }
      }
    }
  }
  expect(selectMeansToBuy(state, 'tBTCUSD')).toEqual(100)
})
