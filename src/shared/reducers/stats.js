import { createReducer } from 'redux-act'
import { botMessage, addStats, addStatsDynamics, setDynamicsTotal, setStopTrade } from '../actions'
import { time } from './helpers'

export const stats = createReducer({
  [addStats]: (state, data) => {
    const newState = [ ...state, data ]
    return newState.slice(newState.length - 2000, newState.length)
  }
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

export const botMessages = createReducer({
  [botMessage]: (state, msg) => [ ...state, [ time(), msg ] ]
}, [ [ time(), 'Initiated' ] ])
