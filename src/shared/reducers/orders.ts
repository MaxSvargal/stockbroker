import debug from 'debug'
import { createReducer } from 'redux-act'
import { newOrder, updateOrder, cancelOrder, setOrders } from 'exchanger/actions'
import { OrderData } from 'shared/types'

export type OrdersState = {
  [id: string]: OrderData
}

const simpleMerge = (state: OrdersState, data: OrderData) =>
  ({ ...state, [data[0]]: data })

const ordersReducer = createReducer<OrdersState>({}, {})

ordersReducer.on(setOrders, (state, data) => {
  debug('worker')(data)
  return ({ ...state, ...data.reduce((a, b) => ({ ...a, [b[0]]: b }), {}) })
})

ordersReducer.on(newOrder, simpleMerge)
ordersReducer.on(updateOrder, simpleMerge)
ordersReducer.on(cancelOrder, simpleMerge)

export default ordersReducer
