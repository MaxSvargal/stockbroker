import analysis from './analysis'

describe('Trade Master Analysis', () => {
  test('should work correctly', async () => {
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
    expect(fetchCandles).toHaveBeenCalledWith({ interval: '30m', limit: 28, symbol: 'FUELETH' })
    expect(fetchCandles).toHaveBeenCalledWith({ interval: '30m', limit: 28, symbol: 'NEOETH' })
    expect(fetchCandles).toHaveBeenCalledWith({ interval: '30m', limit: 28, symbol: 'MCOETH' })
  
    expect(startSignallerProcess).toHaveBeenCalledTimes(3)
    expect(startSignallerProcess).toHaveBeenCalledWith('FUELETH')
    expect(startSignallerProcess).toHaveBeenCalledWith('NEOETH')
    expect(startSignallerProcess).toHaveBeenCalledWith('MCOETH')

    expect(setEnabledSymbols).toHaveBeenCalledTimes(1)
    expect(setEnabledSymbols).toHaveBeenCalledWith([ 'FUELETH', 'NEOETH', 'MCOETH' ])
  })
})