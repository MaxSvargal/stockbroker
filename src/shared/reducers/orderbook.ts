import { createReducer } from 'redux-act'
import { setOrderBook, updateOrderBook } from 'exchanger/actions'
import { OrderBookData } from 'shared/types'

export type OrderbookState = {
  bid: {
    [price: string]: OrderBookData
  },
  ask: {
    [price: string]: OrderBookData
  }
}

const orderbookReducer = createReducer<OrderbookState>({}, { bid: {}, ask: {} })

orderbookReducer.on(setOrderBook, (state, payload) =>
  payload.reduce((prev, [ price, count, amount ]) => {
    const type = amount > 0 ? 'bid' : 'ask'
    return { ...prev, [type]: { ...prev[type], [price]: [ price, count, amount ] } }
  }, { bid: {}, ask: {} }))

orderbookReducer.on(updateOrderBook, (state, [ price, count, amount ]) => {
  const type = amount > 0 ? 'bid' : 'ask'
  const partOfType = state[type]

  const removeEntity = () =>
    Object.keys(partOfType).reduce((prev, curr) =>
      Number(curr) !== price ? { ...prev, [curr]: partOfType[curr] } : prev, {})

  const updateEntity = () =>
    ({ ...partOfType, [price]: [ price, count, amount ] })

  return { ...state, [type]: count === 0 ? removeEntity() : updateEntity() }
})

export default orderbookReducer
