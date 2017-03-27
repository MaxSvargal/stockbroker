import { CURRENT_PAIR } from 'const'

export const selectAsk = state => state.ask
export const selectBid = state => state.bid
export const selectConclusions = state => state.conclusions
export const selectCurrencyPair = state => state.currencies[CURRENT_PAIR]
export const selectCurrentPair = state => state.currentPair.split('_')
export const selectSells = state => state.sell
export const selectTotals = state => state.totals
export const selectWallet = state => state.wallet
export const selectThreshold = state => state.threshold
export const selectChunkedCurrency = state => state.chunkedCurrency
export const selectChunksNumbers = state => state.chunksNumbers

export const selectSellsLastTime = (state, time) => {
  const currTime = new Date().getTime()
  return state.sell.filter(i => i[0] > currTime - time)
}

export const selectBuysLastTime = (state, time) => {
  const currTime = new Date().getTime()
  return state.buy.filter(i => i[0] > currTime - time)
}

export const selectUncoveredSells = state =>
  state.mySells.reduce((prev, curr) => curr[4] === 0 ? [ ...prev, curr ] : prev, [])

export const selectUncoveredBuys = state =>
  state.myBuys.reduce((prev, curr) => curr[4] === 0 ? [ ...prev, curr ] : prev, [])

export const selectPrevStat = state =>
  state.stats[state.stats.length - 2]

export const selectLastTenStat = state =>
  state.stats.slice(state.stats.length - 10, state.stats.length)
