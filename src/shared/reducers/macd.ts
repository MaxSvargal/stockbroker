import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'
import { addMACDResult, clearMACDResults } from 'shared/actions'

export type MACDState = { [symbol: string]: [ number, number ][] }
const macdReducer = createReducer<MACDState>({}, {})

macdReducer.on(addMACDResult, (state, { symbol, time, value }) =>
  assoc(symbol, append([ time, value ], prop(symbol, state)), state))

macdReducer.on(clearMACDResults, (state, { symbol }) =>
  assoc(symbol, [], state))

export default macdReducer
