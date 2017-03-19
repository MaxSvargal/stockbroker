import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { orderBookModify, orderBookRemove, newTrade, setCurrency } from 'actions'

const time = () => new Date().getTime()

// запрос на покупку
export const ask = createReducer({
  [orderBookModify]: (state, { type, rate, amount }) =>
    type === 'ask' ? [ ...state, [ rate, amount, time() ] ] : state,

  [orderBookRemove]: (state, { type, rate, amount }) =>
    type === 'ask' ? state.filter(order => order[0] !== rate) : state,

  [newTrade]: (state, { type, rate, amount }) =>
    type === 'ask' ? [ ...state, [ rate, amount, time() ] ] : state
}, [])

// заявка на продажу
export const bid = createReducer({
  [orderBookModify]: (state, { type, rate, amount }) =>
    type ==='bid' ? [ ...state, [ rate, amount, time() ] ] : state
}, [])

// покупка
export const buy = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type ==='buy' ? [ ...state, [ rate, amount, total, time() ] ] : state
}, [])

// продажи
export const sell = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type ==='sell' ? [ ...state, [ rate, amount, total, time() ] ] : state
}, [])

// валюты
export const currencies = createReducer({
  [setCurrency]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    Object.assign(state, { [currencyPair]: { last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow } })
}, {})

const rootReducer = combineReducers({ ask, bid, buy, sell, currencies })

export default rootReducer
