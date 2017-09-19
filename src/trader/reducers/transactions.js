import { createReducer } from 'redux-act'
import { assign } from 'shared/utils'
import { setOrders, newOrder, updateOrder, cancelOrder } from 'shared/actions'

const formatOrder = o => ({
  id: o[0],
  cid: o[2],
  symbol: o[3],
  created: o[4],
  updated: o[5],
  amount: o[6],
  amountOrig: o[7],
  status: o[13],
  price: o[16]
})

const orders = createReducer({
  [setOrders]: (state, values) =>
    values.reduce((prev, curr) => assign(prev, { [curr[0]]: formatOrder(curr) }), {}),

  [newOrder]: (state, order) =>
    assign(state, { [order[0]]: formatOrder(order) }),

  [updateOrder]: (state, order) =>
    assign(state, { [order[0]]: assign(state[order[0]], formatOrder(order)) }),

  [cancelOrder]: (state, order) =>
    assign(state, { [order[0]]: assign(state[order[0]], formatOrder(order)) })
}, {})

export default orders
