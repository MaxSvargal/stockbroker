import { createReducer } from 'redux-act'

import { time, removeIndex, mergeOnAmount, getOnlyLast } from './helpers'
import { orderBookModify, orderBookRemove, newTrade } from '../actions'

const TWENTY_MINUTES = 1000 * 60 * 20

export const buy = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type === 'buy' ? [ ...state, [ time(), rate, amount, total ] ] : state
}, [])

export const sell = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) =>
    type === 'sell' ? [ ...state, [ time(), rate, amount, total ] ] : state
}, [])

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
