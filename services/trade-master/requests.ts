export const processStartSignalerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Signal Publisher ${symbol}`,
    script: `./services/signal-publisher/index.ts`,
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

export const processStartListenerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Exchange Listener ${symbol}`,
    script: `./services/binance-listener/index.ts`,
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

export const setEnabledSymbolsRequest = (value: string) => ({
  type: 'cacheHashSet', key: 'tradeState', field: 'enabledToBuySymbols', value
})

export const setExchangeInfoRequest = (values: any) => ({
  type: 'cacheHashMultiSet', key: 'exchangeInfoSymbols', values
})
