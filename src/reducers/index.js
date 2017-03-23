import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import deepEqual from 'deep-equal'

import { CURRENT_PAIR, TWENTY_MINUTES } from 'const'
import { time, removeIndex, mergeOnAmount, getOnlyLast } from 'reducers/helpers'
import {
  orderBookModify, orderBookRemove, newTrade,
  setCurrency, setCurrencyPair, addStats, addConclusion,
  doBuy, doSell, botMessage
} from 'actions'

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

export const conclusions = createReducer({
  [addConclusion]: (state, data) =>
    !deepEqual(state[state.length - 1], data) ?
      [ ...state, data ] :
      state
}, [])

export const myBuys = createReducer({
  [doBuy]: (state, data) => [ ...state, [ time(), ...data, 0 ] ]
}, [])

export const mySells = createReducer({
  [doSell]: (state, data) => [ ...state, [ time(), ...data, 0 ] ]
}, [])

export const wallet = createReducer({
  [doBuy]: (state /* , data */) => [ ...state ]
}, [])

export const botMessages = createReducer({
  [botMessage]: (state, msg) => [ ...state, [ time(), msg ] ]
}, [])

export const amountVolume = createReducer({}, 0.0002)

export const threshold = createReducer({}, 0.19)

const rootReducer = combineReducers({
  amountVolume,
  ask,
  bid,
  botMessages,
  buy,
  conclusions,
  currencies,
  currentPair,
  myBuys,
  mySells,
  sell,
  stats,
  threshold,
  wallet
})

export default rootReducer
