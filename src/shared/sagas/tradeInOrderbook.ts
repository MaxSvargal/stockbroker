import debug from 'debug'
import { eventChannel, delay } from 'redux-saga'
import { all, call, take, fork, put, select } from 'redux-saga/effects'
import DecimalPrice from 'shared/lib/decimalPrice'
import { requestNewPassiveOrder, execCancelOrder, execNewOrder } from 'shared/actions'
import { newOrder } from 'exchanger/actions'
import { OrderData } from 'shared/types'
import { selectActiveOrder, selectHighestBids, selectLowestAsks } from 'shared/sagas/selectors'

export const checkIntervalChannel = eventChannel(emitter => {
  const iv = setInterval(() => emitter({ type: 'TICK' }), 2000)
  return () => clearInterval(iv)
})

export function* updateBuyOrderSaga(order: OrderData) {
  const orderId = order[0]
  const orderSymbol = order[3]
  const orderAmount = order[6]
  const orderPrice = order[16]

  const [ [ highestBid ], [ nextHighestBid ] ] = yield select(selectHighestBids)
  const isOurBidGotDown = highestBid - orderPrice !== 0
  const isOurBidTooExpensive = new DecimalPrice(orderPrice).substractIsMoreThenBit(nextHighestBid)

  if (isOurBidGotDown || isOurBidTooExpensive) {
    const nextPrice = isOurBidGotDown ?
      new DecimalPrice(highestBid).increaseBit() :
      new DecimalPrice(nextHighestBid).increaseBit()

    yield put(execCancelOrder({ id: orderId }))
    yield put(execNewOrder({ symbol: orderSymbol, amount: orderAmount, price: nextPrice }))
  }
}

export function* updateSellOrderSaga(order: OrderData)  {
  const orderId = order[0]
  const orderSymbol = order[3]
  const orderAmount = order[6]
  const orderPrice = order[16]

  const [ [ lowestAsk ], [ nextLowestAsk ] ] = yield select(selectLowestAsks)
  const isOurAskGotDown = orderPrice - lowestAsk !== 0
  const isOurAskTooCheap = new DecimalPrice(nextLowestAsk).substractIsMoreThenBit(orderPrice)

  if (isOurAskGotDown || isOurAskTooCheap) {
    const nextPrice = isOurAskGotDown ?
      new DecimalPrice(lowestAsk).decreaseBit() :
      new DecimalPrice(nextLowestAsk).decreaseBit()

    yield put(execCancelOrder({ id: orderId }))
    yield put(execNewOrder({ symbol: orderSymbol, amount: orderAmount, price: nextPrice }))
  }
}

export function* newSellOrderSaga(symbol: string, amount: number) {
  const [ [ lowestAsk ] ] = yield select(selectLowestAsks)
  const price = new DecimalPrice(lowestAsk).decreaseBit()
  yield put(execNewOrder({ symbol, amount, price }))
}

export function* newBuyOrderSaga(symbol: string, amount: number) {
  const [ [ highestBid ] ] = yield select(selectHighestBids)
  const price = new DecimalPrice(highestBid).increaseBit()
  yield put(execNewOrder({ symbol, amount, price }))
}

export function* cancelOrderSaga(symbol: string, type: 'buy' | 'sell') {
  const order = yield select(selectActiveOrder, type, symbol)
  if (order) yield put(execCancelOrder({ id: order[0] }))
}

export function* tradeLoopSaga(symbol: string, amount: number) {
  yield call(amount > 0 ? newBuyOrderSaga : newSellOrderSaga, symbol, amount)
  while (true) {
    yield take(checkIntervalChannel)
    const order = yield select(selectActiveOrder, symbol, amount > 0 ? 'buy' : 'sell')
    if (!order) return true
    yield fork(amount > 0 ? updateBuyOrderSaga : updateSellOrderSaga, order)
  }
}

export function* passiveOrderTradeWatchSaga() {
  while (true) {
    // TODO: add stop limit?
    const { payload: { symbol, amount } } = yield take(requestNewPassiveOrder)
    yield fork(tradeLoopSaga, symbol, amount)
  }
}
