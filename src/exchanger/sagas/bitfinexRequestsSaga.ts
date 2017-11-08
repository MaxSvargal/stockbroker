import debug from 'debug'
import { all, call, take, fork } from 'redux-saga/effects'
import { BFX } from 'bitfinex-api-node'
import { execNewOrder, execCancelOrder } from 'shared/actions'

const { ACCOUNT } = process.env

export function* newOrderSaga(bws: BFX) {
  while (true) {
    const { payload: { symbol, amount, price } } = yield take(execNewOrder.toString())
    const req = [ 0, 'on', null, {
      gid: 1,
      cid: null,
      type: 'EXCHANGE LIMIT',
      symbol: symbol,
      amount: `${amount}`,
      price: `${price}`,
      hidden: 0
    } ]
    // yield call([ bws, 'send' ], req)
    debug('trade')({ action: 'newOrder', symbol, amount, price })
  }
}

export function* cancelOrderSaga(bws: BFX) {
  while (true) {
    const { payload: { id } } = yield take(execCancelOrder)
    const req = [ 0, 'oc', null, { id } ]
    yield call([ bws, 'send' ], req)
    debug('trade')({ action: 'cancelOrder', id })
  }
}

export default function* bitfinexRequestsSaga(bws: BFX): any {
  yield all([
    fork(newOrderSaga, bws),
    fork(cancelOrderSaga, bws)
  ])
}
