import { TEN_MINUTES, CURRENT_PAIR } from 'const'

export const selectAsk = state => state.ask
export const selectBid = state => state.bid
export const selectConclusions = state => state.conclusions
export const selectCurrencyPair = state => state.currencies[CURRENT_PAIR]
export const selectSells = state => state.sell
export const selectTotals = state => state.totals
export const selectWallet = state => state.wallet
export const selectThreshold = state => state.threshold
export const selectChunkedCurrency = state => state.chunkedCurrency
export const selectChunksNumber = state => state.chunksNumber

export const selectSellsLastTime = state =>
  state.sell.filter(i => i[0] > new Date().getTime() - TEN_MINUTES)

export const selectBuysLastTime = state =>
  state.buy.filter(i => i[0] > new Date().getTime() - TEN_MINUTES)

export const selectUncoveredSells = state =>
  state.mySells.reduce((prev, curr) => curr[3] === 0 ? [ ...prev, curr ] : prev, [])

export const selectUncoveredBuys = state =>
  state.myBuys.reduce((prev, curr) => curr[3] === 0 ? [ ...prev, curr ] : prev, [])

export const selectPrevStat = state =>
  state.stats[state.stats.length - 2]
