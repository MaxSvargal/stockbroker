export const requestPositions = (account: string) => () => ({
  type: 'cacheHashGetValues',
  key: `accounts:${account}:positions`
})

export const requestSetPosition = (account: string) => (position: { time: number }) => ({
  type: 'cacheHashSet',
  key: `accounts:${account}:positions`,
  field: position.time,
  value: JSON.stringify(position)
})

export const requestEnabledToBuySymbols = () => ({
  type: 'cacheHashGet',
  key: 'tradeState',
  field: 'enabledToBuySymbols'
})

export const requestExchangeInfoSymbols = (symbol: string) => ({
  type: 'cacheHashGet',
  key: 'exchangeInfoSymbols',
  field: symbol
})

export const requestAccountActiveSymbols = (account: string) => () => ({
  type: 'cacheHashGet',
  key: 'accounts:activeSymbols',
  field: account
})

export const requestSetAccountActiveSymbols = (account: string) => (symbols: string[]) => ({
  type: 'cacheHashSet',
  key: 'accounts:activeSymbols',
  field: account,
  value: symbols
})
