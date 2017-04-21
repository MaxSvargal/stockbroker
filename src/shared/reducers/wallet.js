import { createReducer } from 'redux-act'
import {
  setAutocreatedChunkAmount,
  setBuyProfitThreshold,
  setBalanceValues,
  setCurrency,
  setCurrencyPair,
  setFreeCurrencies,
  setObsoleteThreshold,
  setSellProfitThreshold,
  updateWallet
} from '../actions'

export const wallet = createReducer({
  [updateWallet]: (state, data) =>
    Object.keys(data).reduce((prev, key) =>
      (data[key] !== '0.00000000' ? Object.assign({}, prev, { [key]: data[key] }) : prev), {})
}, {})

export const currencies = createReducer({
  /* eslint max-len: 0 */
  [setCurrency]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    Object.assign({}, state, {
      [currencyPair]: { last: Number(last), lowestAsk: Number(lowestAsk), highestBid: Number(highestBid), percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow }
    })
}, {})

export const freeCurrencies = createReducer({
  [setFreeCurrencies]: (state, values) => values
}, [])

export const buyProfitThreshold = createReducer({
  [setBuyProfitThreshold]: (state, value) => value
}, 0.0001)

export const sellProfitThreshold = createReducer({
  [setSellProfitThreshold]: (state, value) => value
}, 0.0001)

export const obsoleteThreshold = createReducer({
  [setObsoleteThreshold]: (state, value) => value
}, 0.003)

export const autocreatedChunkAmount = createReducer({
  [setAutocreatedChunkAmount]: (state, value) => value
}, 0.01)

export const currentPair = createReducer({
  [setCurrencyPair]: (state, value) => value
}, '')

export const balanceValues = createReducer({
  [setBalanceValues]: (state, value) => value
}, { chunksBuyVolume: 0, chunksSellVolume: 0, availableBuyValue: 0, availableSellValue: 0 })
