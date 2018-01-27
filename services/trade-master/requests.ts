export const processStartSignalerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Symbol ${symbol} Signaller`,
    script: `./services/signal-publisher/index.ts`,
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

export const processStartListenerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Symbol ${symbol} Listener`,
    script: `./services/exchange-listener/index.ts`,
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

export const setEnabledSymbolsRequest = (value: string) => ({
  type: 'cacheHashSet', key: 'tradeState', field: 'enabledToBuySymbols', value
})

export const setExchangeInfoRequest = (values: any) => ({
  type: 'cacheHashMultiSet', key: 'exchangeInfoSymbols', values
})
