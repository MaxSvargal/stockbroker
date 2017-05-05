import { createReducer } from 'redux-act'

import { assign } from './helpers'
import {
  setBuyProfitThreshold,
  setChunkAmount,
  setBalanceValues,
  setCurrency,
  setCurrencyPair,
  setFreeCurrencies,
  setObsoleteThreshold,
  setSellProfitThreshold,
  updateWallet
} from '../actions'

export const currencies = createReducer({
  /* eslint max-len: 0 */
  [setCurrency]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    assign(state, { [currencyPair]: {
      last: Number(last), lowestAsk: Number(lowestAsk), highestBid: Number(highestBid), percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow
    } })
}, {})

// TODO: remove? Use walletLogs instead?
export const wallet = createReducer({
  [updateWallet]: (state, data) => data
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

export const chunkAmount = createReducer({
  [setChunkAmount]: (state, value) => value
}, 0.01)

export const currentPair = createReducer({
  [setCurrencyPair]: (state, value) => value
}, '')

export const balanceValues = createReducer({
  [setBalanceValues]: (state, value) => value
}, { chunksBuyVolume: 0, chunksSellVolume: 0, availableBuyValue: 0, availableSellValue: 0 })
