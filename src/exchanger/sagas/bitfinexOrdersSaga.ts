import debug from 'debug'
import { call, take, fork } from 'redux-saga/effects'
import { BFX } from 'bitfinex-api-node'
import { execAgressiveBuy, execAgressiveSell } from 'shared/actions'

const { ACCOUNT } = process.env

export default function* bitfinexOrdersSaga(bws: BFX): any {
  while (true) {
    const { payload: { symbol, amount, price } } = yield take([ execAgressiveBuy, execAgressiveSell ])
    debug('worker')({ symbol, amount, price })
    const order = [ 0, 'on', null, {
      gid: 1,
      cid: null,
      type: 'EXCHANGE LIMIT',
      symbol: symbol,
      amount: `${amount}`,
      price: `${price}`,
      hidden: 0
    } ]

    yield call([ bws, 'send' ], order)
  }
}
