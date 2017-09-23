import { createReducer } from 'redux-act'
import { setOrderBook, updateOrderBook } from '../actions'

const defaultState = { bid: {}, ask: {} }
const orderBookReducer = createReducer<typeof defaultState>({}, defaultState)

orderBookReducer.on(setOrderBook, (state, payload) =>
  payload.reduce((prev, [ price, count, amount ]) => {
    const type = amount > 0 ? 'bid' : 'ask'
    return { ...prev, [type]: { ...prev[type], [price]: [ price, count, amount ] } }
  }, state))

orderBookReducer.on(updateOrderBook, (state, [ price, count, amount ]) => {
  const type = amount > 0 ? 'bid' : 'ask'
  const partOfType: { [key: string]: number[] } = state[type]

  const removeEntity = () =>
    Object.keys(partOfType).reduce((prev, curr) =>
      Number(curr) !== price ? { ...prev, [curr]: partOfType[curr] } : prev, {})

  const updateEntity = () =>
    ({ ...partOfType, [price]: [ price, count, amount ] })

  return { ...state, [type]: count === 0 ? removeEntity() : updateEntity() }
})

export default orderBookReducer
