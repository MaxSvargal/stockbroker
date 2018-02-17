export const processStartSignallerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Signaller ${symbol}`,
    script: `./services/signaller/index.ts`,
    watch: true,
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

export const setEnabledSymbolsRequest = (value: string) => ({
  type: 'cacheHashSet', key: 'tradeState', field: 'enabledToBuySymbols', value
})

export const setExchangeInfoRequest = (values: any) => ({
  type: 'cacheHashMultiSet', key: 'exchangeInfoSymbols', values
})
