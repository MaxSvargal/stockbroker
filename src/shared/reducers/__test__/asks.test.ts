import asksReducer from '../asks'
import { updateOrderBook } from 'shared/actions'

test('asksReducer < updateOrderBook should work correctly', () => {
  const state = {}
  const action = updateOrderBook([ 100, 1, -2 ])
  const expected = {
    100: [ 100, 1, -2 ]
  }
  expect(asksReducer(state, action)).toEqual(expected)
})
