import { EMA, MACD, signalLine, MACDHistogram } from '../macdHistogram'

const closingPrices = [ 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 ]

test('EMA should work correctly', () => {
  expect(EMA(closingPrices.slice(-12))).toEqual(32.11649081126893)
  expect(EMA(closingPrices)).toEqual(27.015245859014588)
})

test('MACD should work correctly', () => {
  expect(MACD(closingPrices, 12, 26)).toEqual(5.101244952254344)
})

test('signalLine should work correctly', () => {
  expect(signalLine(closingPrices, 12, 26)).toEqual(2.838576983046846)
})

test('MACDHistogram should work correctly', () => {
  expect(MACDHistogram(closingPrices, 12, 26)).toEqual(2.2626679692074982)
})
