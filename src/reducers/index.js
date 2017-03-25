import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { CURRENT_PAIR, TWENTY_MINUTES } from 'const'
import { time, removeIndex, mergeOnAmount, getOnlyLast } from 'reducers/helpers'
import {
  orderBookModify, orderBookRemove, newTrade,
  setCurrency, setCurrencyPair, addStats,
  doBuy, doSell, botMessage, coverSell, coverBuy,
  addBuyChunks, addSellChunks, addChunkedCurrency,
  updateWallet, setFreeCurrencyIsset, setChunkAmount
} from 'actions'

export const botMessages = createReducer({
  [botMessage]: (state, msg) => [ ...state, [ time(), msg ] ]
}, [])

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
  [doBuy]: (state, data) => [ ...state, [ time(), ...data, 0 ] ],
  [coverBuy]: (state, index) => state.slice().sort().map((v, i) => i === index ? [ ...v.slice(0, 3), 1 ] : v),
  [addBuyChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, 0, 1 ]) ]
}, [])

export const mySells = createReducer({
  [doSell]: (state, data) => [ ...state, [ time(), ...data, 0 ] ],
  [coverSell]: (state, index) => state.slice().sort().map((v, i) => i === index ? [ ...v.slice(0, 3), 1 ] : v),
  [addSellChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, 0, 1 ]) ]
}, [])

export const wallet = createReducer({
  [updateWallet]: (state, data) =>
    Object.keys(data).reduce((prev, key) =>
      (data[key] !== '0.00000000' ? Object.assign({}, prev, { [key]: data[key] }) : prev), {})
}, [])

export const chunkedCurrency = createReducer({
  [addChunkedCurrency]: (state, data) => [ ...state, data ]
}, [])

export const freeCurrencyIsset = createReducer({
  [setFreeCurrencyIsset]: (state, status) => status
}, [ 0, 0 ])

export const amountVolume = createReducer({
  [setChunkAmount]: (state, rate) => rate
}, 0.01000001)

export const threshold = createReducer({}, 0.0019)


const rootReducer = combineReducers({
  amountVolume,
  ask,
  bid,
  botMessages,
  buy,
  chunkedCurrency,
  currencies,
  currentPair,
  freeCurrencyIsset,
  myBuys,
  mySells,
  sell,
  stats,
  threshold,
  wallet
})

export default rootReducer
