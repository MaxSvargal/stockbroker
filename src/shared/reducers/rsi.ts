import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'
import { addRSIResult } from 'shared/actions'
import { RSIData } from 'shared/types'

export type RSIState = RSIData[]
const rsiReducer = createReducer<RSIState>({}, [])

rsiReducer.on(addRSIResult, (state, { pair, mts, value }) =>
  <RSIState>append([ mts, value ], state))

export default rsiReducer
