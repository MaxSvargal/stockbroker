import { createReducer } from 'redux-act'
import { setOrderBook, updateOrderBook } from 'exchanger/actions'
import { OrderBookData } from 'shared/types'

export type BidsState = {
  [price: string]: OrderBookData
}

const bidsReducer = createReducer<BidsState>({}, {})

bidsReducer.on(setOrderBook, (state, payload) =>
  payload
    .filter(ask => ask[2] > 0)
    .reduce((prev, [ price, count, amount ]) =>
      ({ ...prev, [price]: [ price, count, amount ] }), {}))

bidsReducer.on(updateOrderBook, (state, [ price, count, amount ]) =>
  amount < 0 ?
    state :
    count === 0 ?
      Object.keys(state).reduce((prev, curr) =>
        Number(curr) !== price ? { ...prev, [curr]: state[curr] } : prev, {}) :
      ({ ...state, [price]: [ price, count, amount ] }))

export default bidsReducer
