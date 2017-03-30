import { createReducer } from 'redux-act'
import { CURRENT_PAIR } from 'const'
import { botMessage, setCurrency, setCurrencyPair, addStats, setFreeCurrencies, setThreshold, updateWallet, addEstimateRatio } from 'actions'
import { time } from 'reducers/helpers'

export const wallet = createReducer({
  [updateWallet]: (state, data) =>
    Object.keys(data).reduce((prev, key) =>
      (data[key] !== '0.00000000' ? Object.assign({}, prev, { [key]: data[key] }) : prev), {})
}, {})

export const currencies = createReducer({
  /* eslint max-len: 0 */
  [setCurrency]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    Object.assign({}, state, {
      [currencyPair]: { last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow }
    })
}, {})

export const freeCurrencies = createReducer({
  [setFreeCurrencies]: (state, values) => values
}, [])

export const threshold = createReducer({
  [setThreshold]: (state, value) => value
}, 0.0001)

export const currentPair = createReducer({
  [setCurrencyPair]: state => state
}, CURRENT_PAIR)

export const stats = createReducer({
  [addStats]: (state, data) => [ ...state, data ]
}, [])

export const statsEstimate = createReducer({
  [addEstimateRatio]: (state, data) => [ ...state, data ]
}, [])

export const botMessages = createReducer({
  [botMessage]: (state, msg) => msg !== state[state.length - 1][1] ?
    [ ...state, [ time(), msg ] ] :
    state
}, [ [ time(), 'Initiated' ] ])
