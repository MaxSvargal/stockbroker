import orderBookReducer from '../orderBook'
import { setOrderBook, updateOrderBook } from 'shared/actions'

test('orderBookReducer < setOrderBook should work correctly', () => {
  const state = { ask: { 1: [] }, bid: { 1: [] } }
  const action = setOrderBook([ [ 100, 1, -2 ], [ 101, 1, -3 ], [ 99, 1, 1 ] ])
  const expected = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ]
    }
  }
  expect(orderBookReducer(state, action)).toEqual(expected)
})

test('orderBookReducer < updateOrderBook should delete ask correctly', () => {
  const state = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ]
    }
  }
  const action = updateOrderBook([ 100, 0, -2 ])
  const expected = {
    ask: {
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ]
    }
  }
  expect(orderBookReducer(state, action)).toEqual(expected)
})

test('orderBookReducer < updateOrderBook should delete bid correctly', () => {
  const state = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ]
    }
  }
  const action = updateOrderBook([ 99, 0, 1 ])
  const expected = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
    }
  }
  expect(orderBookReducer(state, action)).toEqual(expected)
})

test('orderBookReducer < updateOrderBook should add bid correctly', () => {
  const state = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ]
    }
  }
  const action = updateOrderBook([ 98, 1, 1 ])
  const expected = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ],
      98: [ 98, 1, 1 ]
    }
  }
  expect(orderBookReducer(state, action)).toEqual(expected)
})

test('orderBookReducer < updateOrderBook should update bid correctly', () => {
  const state = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ]
    }
  }
  const action = updateOrderBook([ 98, 2, 2 ])
  const expected = {
    ask: {
      100: [ 100, 1, -2 ],
      101: [ 101, 1, -3 ]
    },
    bid: {
      99: [ 99, 1, 1 ],
      98: [ 98, 2, 2 ]
    }
  }
  expect(orderBookReducer(state, action)).toEqual(expected)
})
