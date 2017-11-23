import { createReducer } from 'redux-act'
import { setOrderBook, updateOrderBook } from 'shared/actions'
import { OrderBookData } from 'shared/types'

export type AsksState = {
  [price: string]: OrderBookData
}

const asksReducer = createReducer<AsksState>({}, {})

asksReducer.on(setOrderBook, (state, payload) =>
  payload
    .filter(ask => ask[2] < 0)
    .reduce((prev, [ price, count, amount ]) =>
      ({ ...prev, [price]: [ price, count, amount ] }), {}))

asksReducer.on(updateOrderBook, (state, [ price, count, amount ]) =>
  amount > 0 ?
    state :
    count === 0 ?
      Object.keys(state).reduce((prev, curr) =>
        Number(curr) !== price ? { ...prev, [curr]: state[curr] } : prev, {}) :
      ({ ...state, [price]: [ price, count, amount ] }))

export default asksReducer
