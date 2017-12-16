import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'
import { addMACDResult, clearMACDResults } from 'shared/actions'

export type MACDState = { [symbol: string]: [ number, number, number ][] }
const macdReducer = createReducer<MACDState>({}, {})

macdReducer.on(addMACDResult, (state, { pair, time, interval, value }) =>
  assoc(pair, append([ time, interval, value ], prop(pair, state)), state))

macdReducer.on(clearMACDResults, (state, { symbol }) =>
  assoc(symbol, [], state))

export default macdReducer
