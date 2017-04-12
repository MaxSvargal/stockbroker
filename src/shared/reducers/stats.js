import { createReducer } from 'redux-act'
import { botMessage, addStats, setCurrentFinalResult } from '../actions'
import { time } from './helpers'

export const stats = createReducer({
  [addStats]: (state, data) => {
    const newState = [ ...state, data ]
    return newState.slice(newState.length - 2000, newState.length)
  }
}, [])

export const statsResult = createReducer({
  [setCurrentFinalResult]: (state, data) => data
}, 0)

export const botMessages = createReducer({
  [botMessage]: (state, msg) => [ ...state, [ time(), msg ] ]
}, [ [ time(), 'Initiated' ] ])
