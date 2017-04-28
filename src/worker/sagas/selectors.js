import { cropNumber } from '../../shared/utils'

export const selectCurrentTime = () => Date.now()
export const selectAvaliableValue = ({ wallet }, currency) => wallet[currency]
export const selectAsk = state => state.ask
export const selectBid = state => state.bid
export const selectBuyTransactions = state => state.buyTransactions
export const selectChunkedCurrency = state => state.chunkedCurrency
export const selectConclusions = state => state.conclusions
export const selectCurrencyPair = state => state.currentPair
export const selectCurrencyPairSplited = state => state.currentPair.split('_')
export const selectCurrencyProps = state => state.currencies[state.currentPair]
export const selectSells = state => state.sell
export const selectTransactions = state => state.transactions
export const selectBuyProfitThreshold = state => state.buyProfitThreshold
export const selectSellProfitThreshold = state => state.sellProfitThreshold
export const selectObsoleteThreshold = state => state.obsoleteThreshold
export const selectAutocreatedChunkAmount = state => state.autocreatedChunkAmount
export const selectTotals = state => state.totals
export const selectWallet = state => state.wallet
export const selectStopTrade = state => state.stopTrade
export const selectLastStat = ({ stats }) => stats[stats.length - 1]
export const selectLastStats = ({ stats }, num) => stats.slice(stats.length - num - 1, stats.length - 1)
export const selectStatsDuringTime = (state, time) => state.stats.filter(i => i.created >= time)
export const selectBuysDuringTime = (state, time) => state.buy.filter(i => i[0] >= time)
export const selectSellsDuringTime = (state, time) => state.sell.filter(i => i[0] >= time)

export const selectBuyForCover = ({ transactions }, rate) => {
  const matches = Object.keys(transactions)
    .filter(key =>
      transactions[key].active === true &&
      transactions[key].type === 'buy' &&
      transactions[key].rate < rate)

  return matches.length >= 1 ?
    matches
      .sort((a, b) => transactions[b].rate - transactions[a].rate)
      .sort((a, b) => transactions[b].amount - transactions[a].amount)
      .sort(key => transactions[key].creationMethod === 'hollow')[0] :
    false
}

export const selectSellForCover = ({ transactions }, rate) => {
  const matches = Object.keys(transactions)
    .filter(key =>
      transactions[key].active === true &&
      transactions[key].type === 'sell' &&
      transactions[key].rate > rate)

  return matches.length >= 1 ?
    matches
      .sort((a, b) => transactions[b].rate - transactions[a].rate)
      .sort((a, b) => transactions[b].amount - transactions[a].amount)
      .sort(key => transactions[key].creationMethod === 'hollow')[0] :
    false
}

export const selectObsoleteTransactions = ({ transactions, obsoleteThreshold }, lastRate) =>
  Object.keys(transactions).filter(key =>
    transactions[key].creationMethod === 'hollow' &&
    transactions[key].active === true &&
    (lastRate - transactions[key].rate > obsoleteThreshold ||
      transactions[key].rate - lastRate > obsoleteThreshold))

export const selectVolumeOfChunksType = ({ transactions }, type) =>
  cropNumber(Object.keys(transactions)
    .filter(key =>
      transactions[key].active === true &&
      transactions[key].type === type)
    .map(key => transactions[key].amount)
    .reduce((prev, curr) => prev + curr, 0))
