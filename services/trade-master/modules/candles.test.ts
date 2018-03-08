import { makeFetchCandles } from './candles'

describe('Candles suite', () => {
  test('fetchCandles should work correctly', async () => {
    const fetch = jest.fn().mockImplementation(() => Promise.resolve([ 1 ]))
    const result = await makeFetchCandles(fetch)('BTCUSDT')
    expect(result).toEqual([ 'BTCUSDT', [ [ 1 ], [ 1 ], [ 1 ] ] ])

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenCalledWith({ limit: 28, interval: '4h', symbol: 'BTCUSDT' })
    expect(fetch).toHaveBeenCalledWith({ limit: 28, interval: '1h', symbol: 'BTCUSDT' })
    expect(fetch).toHaveBeenCalledWith({ limit: 28, interval: '15m', symbol: 'BTCUSDT' })
  })
})