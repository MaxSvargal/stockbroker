import { checkRVIState, checkMACDState, getDecision } from '../analytic'

test('checkRVI should work correctly', () => {
  expect(checkRVIState(1, 2, 2, 1)).toEqual(1)
  expect(checkRVIState(2, 1, 1, 2)).toEqual(-1)
  expect(checkRVIState(2, 1, 3, 2)).toEqual(0)
  expect(checkRVIState(2, 2, 3, 3)).toEqual(0)
})

test('checkMACDState should work correctly', () => {
  expect(checkMACDState(-1, 1)).toEqual(1)
  expect(checkMACDState(1, -1)).toEqual(-1)
  expect(checkMACDState(1, 2)).toEqual(0)
  expect(checkMACDState(-1, -2)).toEqual(0)
})

test('getDecision shoud return 0 by defaut', () => {
  expect(getDecision({ macd: 0, rvi: 0, rviValue: 0, stochValue: 0, macdValue: 0 })).toEqual(0)
})

test('getDecision should return buy signal (1) when MACD cross up the zero and RVI is near zero', () => {
  expect(getDecision({ macd: 1, rvi: 0, rviValue: -1, stochValue: 84, macdValue: 0 })).toEqual(1)
})

test('getDecision shouldn\'t return a buy signal (1) when MACD cross up the zero and RVI is below zero', () => {
  expect(getDecision({ macd: 1, rvi: 0, rviValue: 1, stochValue: 0, macdValue: 0 })).toEqual(0)
})

test('getDecision shouldn\'t return a buy signal (1) when Stochastic is greater then 85', () => {
  expect(getDecision({ macd: 1, rvi: 0, rviValue: -1, stochValue: 86, macdValue: 0 })).toEqual(0)
})

test('getDecision should return sell signal (-1) when RVI signal cross up the average and it below zero and stochastic is more then 50 and MACD osci is more then 1', () => {
  expect(getDecision({ macd: 0, rvi: -1, rviValue: 1, stochValue: 51, macdValue: 1.01 })).toEqual(-1)
})

test('getDecision shouldn\'t return sell signal (0) when RVI signal cross up the average and it near zero', () => {
  expect(getDecision({ macd: 0, rvi: -1, rviValue: -1, stochValue: 0, macdValue: 0 })).toEqual(0)
})

test('getDecision shouldn\'t return sell signal (0) when Stochastic is lower then 50', () => {
  expect(getDecision({ macd: 0, rvi: -1, rviValue: 1, stochValue: 51, macdValue: 0 })).toEqual(0)
})

test.skip('getDecision should return sell signal (false) when MACD cross down the zero')
test.skip('getDecision should return buy signal (true) when RVI near zero and cross down the average twice')
