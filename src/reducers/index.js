import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { orderBookModify, orderBookRemove, newTrade, setCurrency, setCurrencyPair } from 'actions'
import { CURRENT_PAIR } from 'const'

const time = val => val ? new Date(val).getTime() : new Date().getTime()

const removeIndex = (arr, index) => index === -1 ? arr :
  [ ...arr.slice(0, index), ...arr.slice(index + 1) ]

const mergeOnAmount = (state, rate, amount) =>
  amount ?
    [ ...state, [ time(), rate, amount ] ] :
    [ ...state.slice(0, -1), [ time(), rate, state[state.length - 1][1] ] ]

// запрос на покупку
export const ask = createReducer({
  [newTrade]: (state, { type, rate, amount }) =>
    type === 'ask' && (state.length > 0 || amount) ? mergeOnAmount(state, rate, amount) : state,

  [orderBookModify]: (state, { type, rate, amount }) =>
    type === 'ask' && state.length > 0 ? mergeOnAmount(state, rate, amount) : state,

  [orderBookRemove]: (state, { type, rate }) =>
    type === 'ask' ? removeIndex(state, state.findIndex(e => e[0] === rate)) : state
}, [])

// заявка на продажу
export const bid = createReducer({
  [newTrade]: (state, { type, rate, amount }) =>
    type === 'bid' && (state.length > 0 || amount) > 0 ? mergeOnAmount(state, rate, amount) : state,

  [orderBookModify]: (state, { type, rate, amount }) =>
    type === 'bid' && state.length > 0 ? mergeOnAmount(state, rate, amount) : state,

  [orderBookRemove]: (state, { type, rate }) =>
    type === 'bid' ? removeIndex(state, state.findIndex(e => e[0] === rate)) : state
}, [])

// покупка
export const buy = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type ==='buy' ? [ ...state, [ time(), rate, amount, total ] ] : state
}, [])

// продажи
export const sell = createReducer({
  [newTrade]: (state, { type, rate, amount, total, date }) =>
    type ==='sell' ? [ ...state, [ time(/*date*/), rate, amount, total ] ] : state
}, [])

// валюты
export const currencies = createReducer({
  [setCurrency]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    Object.assign(state, { [currencyPair]: { last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow } })
}, {})

export const currentPair = createReducer({
  [setCurrencyPair]: state => state
}, CURRENT_PAIR)

const rootReducer = combineReducers({ ask, bid, buy, sell, currencies, currentPair })

export default rootReducer
