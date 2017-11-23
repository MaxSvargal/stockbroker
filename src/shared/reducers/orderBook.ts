import { assoc, filter, gt, lt, converge, zipObj, map, tail, nth, o, identity, merge, ifElse, prop, equals, dissoc, apply, always, compose, curry } from 'ramda'
import { createReducer } from 'redux-act'
import { setOrderBook, updateOrderBook } from 'shared/actions'
import { OrderBookData } from 'shared/types'

export type OrderBookState = {
  ask: {
    [price: string]: OrderBookData
  },
  bid: {
    [price: string]: OrderBookData
  }
}

const orderBookReducer = createReducer<OrderBookState>({}, { ask: {}, bid: {} })

const [ price, count, amount ] = [ nth(0), nth(1), nth(2) ]
const [ bid, ask ] = [ always('bid'), always('ask') ]
const onlyPositive = filter(o(lt(0), amount))
const onlyNegative = filter(o(gt(0), amount))
const transformRawToObj = converge(zipObj, [ map(price), identity ])
const countIsNil = o(equals(0), count)
const bidOrAsk = ifElse(compose(gt(0), amount), ask, bid)
const partOf = curry((state: OrderBookState, payload: OrderBookData) =>
  prop(bidOrAsk(payload), state))

orderBookReducer.on(setOrderBook, (state, payload) => merge(
  assoc('bid', o(transformRawToObj, onlyPositive)(payload), {}),
  assoc('ask', o(transformRawToObj, onlyNegative)(payload), {})
))

orderBookReducer.on(updateOrderBook, (state, payload) =>
  converge(assoc, [
    bidOrAsk,
    ifElse(
      countIsNil,
      converge(dissoc, [ price, partOf(state) ]),
      converge(assoc, [ price, identity, partOf(state) ])
    ),
    always(state)
  ])(payload)
)

export default orderBookReducer
