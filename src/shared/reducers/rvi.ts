import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'
import { addRVIResult, clearRVIResults } from 'shared/actions'

export type RVIState = { [symbol: string]: [ number, number, number ][] }
const rviReducer = createReducer<RVIState>({}, {})

rviReducer.on(addRVIResult, (state, { symbol, time, average, signal }) =>
  assoc(symbol, append([ time, average, signal ], prop(symbol, state)), state))

rviReducer.on(clearRVIResults, (state, { symbol }) =>
  assoc(symbol, [], state))

export default rviReducer
