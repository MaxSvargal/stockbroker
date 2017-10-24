import macdReducer from '../macd'
import { addMACDResult, clearMACDResults } from 'shared/actions'

test('macdReducer should add correctly', () => {
  const state = { tBTCUSD: [ [ 0, 0 ], [ 1, 2 ] ] }
  const action = addMACDResult({ symbol: 'tBTCUSD', value: 3, time: 2 })
  const expected = { tBTCUSD: [ [ 0, 0 ], [ 1, 2 ], [ 2, 3 ] ] }
  expect(macdReducer(state, action)).toEqual(expected)
})

test('macdReducer should clear correctly', () => {
  const state = { tBTCUSD: [ [ 0, 0 ], [ 1, 2 ] ] }
  const action = clearMACDResults({ symbol: 'tBTCUSD' })
  const expected = { tBTCUSD: [] }
  expect(macdReducer(state, action)).toEqual(expected)
})
