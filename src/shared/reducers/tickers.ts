import { createReducer } from 'redux-act'
import { updateTicker } from 'exchanger/actions'
import { TickerData } from 'shared/types'

export type TickersState = {
  [pair: string]: TickerData
}

const tickersReducer = createReducer<TickersState>({}, {})

tickersReducer.on(updateTicker, (state, { pair, data }) =>
  ({ ...state, [pair]: data }))

export default tickersReducer
