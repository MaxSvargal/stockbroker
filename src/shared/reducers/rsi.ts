import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'
import { addRSIResult } from 'shared/actions'

export type RSIState = [ number, number ][]
const rsiReducer = createReducer<RSIState>({}, [])

rsiReducer.on(addRSIResult, (state, payload) =>
  append(payload, state))

export default rsiReducer
