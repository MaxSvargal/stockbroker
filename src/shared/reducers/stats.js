import { createReducer } from 'redux-act'
import { addStats, addStatsDynamics, setDynamicsTotal, setStopTrade, updateWallet } from '../actions'
import { now, assign, removeLast, last } from './helpers'

const MINUTE = 1000 * 60

export const stats = createReducer({
  [addStats]: (state, data) =>
    state.length <= 0 ? [ data ] :
      (last(state).created <= data.created - MINUTE) ?
        [ ...state, data ] :
        [ ...removeLast(state), assign(data, { created: last(state).created }) ]
}, [])

export const statsDynamics = createReducer({
  [addStatsDynamics]: (state, data) => {
    const newState = [ ...state, [ data.buysDyn, data.sellsDyn ] ]
    return newState.slice(newState.length - 100, newState.length)
  }
}, [])

export const statsDynamicsTotal = createReducer({
  [setDynamicsTotal]: (state, data) => data
}, 0)

export const stopTrade = createReducer({
  [setStopTrade]: (state, status) => status
}, false)

export const walletLogs = createReducer({
  [updateWallet]: (state, data) => [ ...state, [ now(), data ] ]
}, [])
