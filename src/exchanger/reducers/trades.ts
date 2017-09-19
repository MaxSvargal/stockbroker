import { createReducer } from 'redux-act'
import { limit } from 'shared/utils'
import { newTrade } from '../actions'

export const trades = createReducer({
  [newTrade]: (state, action) =>
    limit([ ...state, action.trade ], 100)
}, [])

export default trades
