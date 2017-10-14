import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { addMACDResult, clearMACDResults } from 'shared/actions'
import { TickerData } from 'shared/types'

export type MACDState = {
  [symbol: string]: number[]
}

const macdReducer = createReducer<MACDState>({}, {})

macdReducer.on(addMACDResult, (state, { symbol, value }) =>
  state[symbol].slice(-1)[0] !== value ?
    { ...state, [symbol]: [ ...state[symbol], value ] } :
    state)

macdReducer.on(clearMACDResults, (state, { symbol }) =>
  ({ ...state, [symbol]: [] }))

export default macdReducer
