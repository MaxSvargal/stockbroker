import { suitableSymbolsFromTicker } from './symbols'

describe('Symbols suite', () => {
  test('suitableSymbolsFromTicker should work correctly', () => {
    const ticker = [
      { symbol: 'NEOETH', priceChangePercent: '20.1' },
      { symbol: 'NEOBTC', priceChangePercent: '0.2' },
      { symbol: 'BTCUSDT', priceChangePercent: '32.1' }
    ]
    const result = suitableSymbolsFromTicker([ 'BTC', ticker ])
    expect(result).toEqual([ 'BTCUSDT', 'NEOBTC' ])
  })
})
