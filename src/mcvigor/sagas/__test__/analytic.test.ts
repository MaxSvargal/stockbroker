import { approveMACDSignal, checkRVISignal } from '../analytic'

test('checkRVISignal should work correctly', () => {
  expect(checkRVISignal(1, 2)()).toEqual({ buy: false, sell: false })
  expect(checkRVISignal(2, 1)()).toEqual({ buy: false, sell: true })
  expect(checkRVISignal(3, 2)()).toEqual({ buy: false, sell: true })
  expect(checkRVISignal(1, 2)()).toEqual({ buy: true, sell: false })
  expect(checkRVISignal(-2, -1)()).toEqual({ buy: true, sell: false })
  expect(checkRVISignal(-1, -2)()).toEqual({ buy: false, sell: true })
})

test('approveMACDSignal should work correctly', () => {
  console.log(approveMACDSignal)
  expect(approveMACDSignal(1)({ buy: true, sell: false })()).toEqual({ buy: false, sell: false })
  expect(approveMACDSignal(-1)({ buy: true, sell: false })()).toEqual({ buy: true, sell: false })
  expect(approveMACDSignal(1)({ buy: true, sell: false })()).toEqual({ buy: false, sell: false })
  expect(approveMACDSignal(-1)({ buy: false, sell: true })()).toEqual({ buy: false, sell: false })
  expect(approveMACDSignal(1)({ buy: false, sell: true })()).toEqual({ buy: false, sell: true })
  expect(approveMACDSignal(2)({ buy: false, sell: false })()).toEqual({ buy: false, sell: false })

})
