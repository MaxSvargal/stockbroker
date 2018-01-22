export const processStartSignalerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Signal Publisher ${symbol}`,
    script: `./services/signal-publisher/index.ts`,
    env: { SYMBOL: symbol }
  }
})

export const processStartListenerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Binance Exchange Listener ${symbol}`,
    script: `./services/binance-listener/index.ts`,
    env: { SYMBOL: symbol }
  }
})

export const getCurrentSymbolRequest = () => ({
  type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol'
})

export const setCurrentSymbolRequest = (value: string) => ({
  type: 'cacheHashSet', key: 'tradeState', field: 'currentSymbol', value
})

export const setSymbolWeights = (value: string) => ({
  type: 'cacheHashSet', key: 'tradeState', field: 'symbolWeights', value
})

export const setExchangeInfoRequest = (values: any) => ({
  type: 'cacheHashMultiSet', key: 'exchangeInfoSymbols', values: values
})
