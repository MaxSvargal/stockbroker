import candlesReducer from '../candles'
import { setCandles, updateCandle } from 'shared/actions'

test('candlesReducer < setCandles should work correctly', () => {
  const state = {}
  const action = setCandles([
    "trade:1m:tBTCUSD", [
      [ 1511452920000, 8155, 8153, 8155.1, 8150, 30 ],
      [ 1511452860000, 8157.9, 8155.1, 8158, 8152.1, 13 ]
    ]
  ])
  const expected = {
    'trade:1m:tBTCUSD': {
      1511452920000: [ 8155, 8153, 8155.1, 8150, 30 ],
      1511452860000: [ 8157.9, 8155.1, 8158, 8152.1, 13 ],
    }
  }
  expect(candlesReducer(state, action)).toEqual(expected)
})

test('candlesReducer < updateCandle should work correctly', () => {
  const state = {
    'trade:1m:tBTCUSD': {
      1511452920000: [ 8155, 8153, 8155.1, 8150, 30 ],
      1511452860000: [ 8157.9, 8155.1, 8158, 8152.1, 13 ],
    }
  }
  const action = updateCandle([
    "trade:1m:tBTCUSD", [ 1511452920000, 1, 1, 1, 1, 1 ]
  ])
  const expected = {
    'trade:1m:tBTCUSD': {
      1511452920000: [ 1, 1, 1, 1, 1 ],
      1511452860000: [ 8157.9, 8155.1, 8158, 8152.1, 13 ],
    }
  }
  expect(candlesReducer(state, action)).toEqual(expected)
})
