import { repeat } from 'ramda'
import { analyzer, fetchCandlesRecursively } from './analysis'

describe('Trade Master Analysis', () => {
  test.skip('should work correctly', async () => {
    const ticker = [
      { symbol: 'NEOETH', priceChangePercent: '20.1' },
      { symbol: 'MCOETH', priceChangePercent: '0.2' },
      { symbol: 'FUELETH', priceChangePercent: '32.1' },
      { symbol: 'NEOUSDT', proceChangePercent: '1' }
    ]
    const candles = [
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ]
    ]

    const fetchTicker = jest.fn().mockReturnValueOnce(ticker)
    const fetchCandles = jest.fn().mockReturnValue(candles)
    const setEnabledSymbols = jest.fn()
    const startSignallerProcess = jest.fn()

    await analysis({ fetchTicker, fetchCandles, setEnabledSymbols, startSignallerProcess })

    expect(fetchCandles).toHaveBeenCalledTimes(3)
    expect(fetchCandles).toHaveBeenCalledWith({ interval: '15m', limit: 28, symbol: 'FUELETH' })
    expect(fetchCandles).toHaveBeenCalledWith({ interval: '15m', limit: 28, symbol: 'NEOETH' })
    expect(fetchCandles).toHaveBeenCalledWith({ interval: '15m', limit: 28, symbol: 'MCOETH' })
  
    expect(startSignallerProcess).toHaveBeenCalledTimes(3)
    expect(startSignallerProcess).toHaveBeenCalledWith('FUELETH')
    expect(startSignallerProcess).toHaveBeenCalledWith('NEOETH')
    expect(startSignallerProcess).toHaveBeenCalledWith('MCOETH')

    expect(setEnabledSymbols).toHaveBeenCalledTimes(1)
    expect(setEnabledSymbols).toHaveBeenCalledWith([ 'FUELETH', 'NEOETH', 'MCOETH' ])
  })

  test('should be work', () => {
    const symbols = [ 'NEOETH', 'MCOETH' ]
    const candles = [ [
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.3', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.1', '0.1', '0.1', '0.1', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
    ], [
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.3', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
    ] ]

    expect(analyzer(symbols, candles)).toEqual([ 'NEOETH' ])
  })

  test('should fetchCandlesRecursively work correctly', async () => {
    const candles = [
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.2', '100' ],
      [ 0, '0.3', '0.4', '0.2', '0.3', '100' ],
      [ 0, '0.4', '0.5', '0.3', '0.4', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.2', '0.3', '0.1', '0.3', '100' ],
      [ 0, '0.5', '0.6', '0.4', '0.5', '100' ],
      [ 0, '0.6', '0.7', '0.5', '0.6', '100' ],
      [ 0, '0.8', '0.8', '0.6', '0.7', '100' ],
      [ 0, '0.9', '0.9', '0.7', '0.8', '100' ],
    ]
    const now = Date.now()
    Date.now = jest.fn(() => now)
    const symbols = [ 'BTCUSDT', 'MCOBTC', 'NEOBTC' ]
    const fetchSymbolState = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ symbol: 'BTCUSDT', timestamp: '2018-03-03T21:23:29.589Z', '4h': false, '1h': false,'15m': false }))
      .mockImplementationOnce(() => Promise.resolve({ symbol: 'MCOBTC', timestamp: Date.now(), '4h': true, '1h': false,'15m': false }))
      .mockImplementationOnce(() => Promise.resolve({ symbol: 'NEOBTC', timestamp: '2018-03-06T00:23:29.589Z', '4h': true, '1h': false,'15m': false }))
    
    const fetchCandles = jest.fn().mockImplementation(() => Promise.resolve(candles))
    const saveSymbolState = jest.fn().mockImplementationOnce(() => Promise.resolve())

    await fetchCandlesRecursively({ fetchSymbolState, fetchCandles, saveSymbolState })(symbols)

    expect(fetchSymbolState).toHaveBeenCalledTimes(3)
    expect(fetchCandles).toHaveBeenCalledTimes(6)
    expect(saveSymbolState).toHaveBeenCalledTimes(2)
    expect(saveSymbolState).toHaveBeenCalledWith({ symbol: 'BTCUSDT', timestamp: now, '4h': true, '1h': false, '15m': false })
    expect(saveSymbolState).toHaveBeenCalledWith({ symbol: 'NEOBTC', timestamp: now, '4h': true, '1h': false, '15m': false })
    console.log('complete')
  })
})