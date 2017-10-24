import { selectLastRVIResult } from '../selectors'

test('selectLastRVIResult should work correctly', () => {
  expect(selectLastRVIResult({ rvi: {} }, 'tBTCUSD')).toEqual([])
  expect(selectLastRVIResult({ rvi: { tBTCUSD: [ 1, 2 ] } }, 'tBTCUSD')).toEqual(2)
})
