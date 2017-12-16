import rsiReducer from '../rsi'
import { addRSIResult } from 'shared/actions'

test('rsiReducer should add item correctly', () => {
  const state = [ [ 0, 0 ], [ 1, 2 ] ]
  const action = rsiReducer(state, [ 2, 3 ])
  const expected = [ [ 0, 0 ], [ 1, 2 ], [ 2, 3 ] ]
  expect(addRSIResult(state, action)).toEqual(expected)
})
