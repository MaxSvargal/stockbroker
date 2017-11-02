import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'
import { addStochResult, clearStochResults } from 'shared/actions'

export type StochState = { [symbol: string]: [ number, number ][] }
const stochReducer = createReducer<StochState>({}, {})

stochReducer.on(addStochResult, (state, { symbol, time, value }) =>
  assoc(symbol, append([ time, value ], prop(symbol, state)), state))

stochReducer.on(clearStochResults, (state, { symbol }) =>
  assoc(symbol, [], state))

export default stochReducer
