import { createReducer } from 'redux-act'

import { newTrade } from '../actions'
import { now } from './helpers'

export const buy = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) => {
    if (type === 'buy') {
      const newState = [ ...state, [ now(), rate, amount, total ] ]
      return newState.slice(newState.length - 1000, newState.length)
    }
    return state
  }
}, [])

export const sell = createReducer({
  [newTrade]: (state, { type, rate, amount, total }) => {
    if (type === 'sell') {
      const newState = [ ...state, [ now(), rate, amount, total ] ]
      return newState.slice(newState.length - 1000, newState.length)
    }
    return state
  }
}, [])

/*
export const ask = createReducer({
  [newTrade]: (state, { type, rate, amount }) => {
    if (type === 'ask' && (state.length > 0 || amount)) {
      const newState = mergeOnAmount(state, rate, amount)
      return newState.slice(newState.length - 50, newState.length)
    }
    return state
  },

  [orderBookModify]: (state, { type, rate, amount }) => {
    if (type === 'ask' && (state.length > 0 || amount)) {
      const newState = mergeOnAmount(state, rate, amount)
      return newState.slice(newState.length - 50, newState.length)
    }
    return state
  },

  [orderBookRemove]: (state, { type, rate }) =>
    type === 'ask' ?
      removeIndex(state, state.findIndex(e => e[0] === rate)) :
      state
}, [])

export const bid = createReducer({
  [newTrade]: (state, { type, rate, amount }) => {
    if (type === 'bid' && (state.length > 0 || amount)) {
      const newState = mergeOnAmount(state, rate, amount)
      return newState.slice(newState.length - 50, newState.length)
    }
    return state
  },

  [orderBookModify]: (state, { type, rate, amount }) => {
    if (type === 'bid' && (state.length > 0 || amount)) {
      const newState = mergeOnAmount(state, rate, amount)
      return newState.slice(newState.length - 50, newState.length)
    }
    return state
  },

  [orderBookRemove]: (state, { type, rate }) =>
    type === 'bid' ?
      removeIndex(state, state.findIndex(e => e[0] === rate)) :
      state
}, [])
*/
