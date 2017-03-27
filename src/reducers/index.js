import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { CURRENT_PAIR, TWENTY_MINUTES } from 'const'
import { time, removeIndex, mergeOnAmount, getOnlyLast } from 'reducers/helpers'
import {
  orderBookModify, orderBookRemove, newTrade,
  setCurrency, setCurrencyPair, addStats,
  buySuccess, sellSuccess, botMessage, coverSell, coverBuy,
  addBuyChunks, addSellChunks, addChunkedCurrency,
  updateWallet, sellFailure, buyFailure,
  setThreshold, setChunksNumbers
} from 'actions'

export const botMessages = createReducer({
  [botMessage]: (state, msg) => msg !== state[state.length - 1][1] ?
    [ ...state, [ time(), msg ] ] :
    state
}, [ [ time(), 'Initiated' ] ])

// запрос на покупку
export const ask = createReducer({
  [newTrade]: (state, { type, rate, amount }) =>
    type === 'ask' && (state.length > 0 || amount) ?
      getOnlyLast(mergeOnAmount(state, rate, amount), TWENTY_MINUTES) :
      state,

  [orderBookModify]: (state, { type, rate, amount }) =>
    type === 'ask' && (state.length > 0 || amount) ?
      getOnlyLast(mergeOnAmount(state, rate, amount), TWENTY_MINUTES) :
      state,

  [orderBookRemove]: (state, { type, rate }) =>
    type === 'ask' ?
      removeIndex(state, state.findIndex(e => e[0] === rate)) :
      state
}, [])

// заявка на продажу
export const bid = createReducer({
  [newTrade]: (state, { type, rate, amount }) =>
    type === 'bid' && (state.length > 0 || amount) > 0 ?
      getOnlyLast(mergeOnAmount(state, rate, amount), TWENTY_MINUTES) :
      state,

  [orderBookModify]: (state, { type, rate, amount }) =>
    type === 'bid' && (state.length > 0 || amount) > 0 ?
      getOnlyLast(mergeOnAmount(state, rate, amount), TWENTY_MINUTES) :
      state,

  [orderBookRemove]: (state, { type, rate }) =>
    type === 'bid' ?
      removeIndex(state, state.findIndex(e => e[0] === rate)) :
      state
}, [])

// покупка
export const buy = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type === 'buy' ? [ ...state, [ time(), rate, amount, total ] ] : state
}, [])

// продажи
export const sell = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type === 'sell' ? [ ...state, [ time(), rate, amount, total ] ] : state
}, [])

// валюты
export const currencies = createReducer({
  /* eslint max-len: 0 */
  [setCurrency]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    Object.assign(state, { [currencyPair]: { last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow } })
}, {})

export const currentPair = createReducer({
  [setCurrencyPair]: state => state
}, CURRENT_PAIR)

export const stats = createReducer({
  [addStats]: (state, data) => [ ...state, data ]
}, [])

export const myBuys = createReducer({
  [buySuccess]: (state, data) => [ ...state, [ time(), ...data, 0 ] ],
  [coverBuy]: (state, index) => state.slice().sort().map((v, i) => i === index ? [ ...v.slice(0, 4), 1 ] : v),
  [addBuyChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, -1, 0 ]) ]
}, [])

export const mySells = createReducer({
  [sellSuccess]: (state, data) => [ ...state, [ time(), ...data, 0 ] ],
  [coverSell]: (state, index) => state.slice().sort().map((v, i) => i === index ? [ ...v.slice(0, 4), 1 ] : v),
  [addSellChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, -1, 0 ]) ]
}, [])

export const myFailureSells = createReducer({
  [sellFailure]: (state, data) => [ ...state, [ time(), ...data ] ]
}, [])

export const myFailureBuys = createReducer({
  [buyFailure]: (state, data) => [ ...state, [ time(), ...data ] ]
}, [])

export const wallet = createReducer({
  [updateWallet]: (state, data) =>
    Object.keys(data).reduce((prev, key) =>
      (data[key] !== '0.00000000' ? Object.assign({}, prev, { [key]: data[key] }) : prev), {})
}, {})

export const chunkedCurrency = createReducer({
  [addChunkedCurrency]: (state, data) => [ ...state, data ]
}, [])

export const threshold = createReducer({
  [setThreshold]: (state, value) => value
}, 0.0001)

export const chunksNumbers = createReducer({
  [setChunksNumbers]: (state, nums) => nums
}, [ 0, 0 ])

const rootReducer = combineReducers({
  ask,
  bid,
  botMessages,
  buy,
  chunkedCurrency,
  chunksNumbers,
  currencies,
  currentPair,
  myBuys,
  mySells,
  myFailureSells,
  myFailureBuys,
  sell,
  stats,
  threshold,
  wallet
})

export default rootReducer
