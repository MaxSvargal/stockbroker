import debug from 'debug'
import { call, take, fork } from 'redux-saga/effects'
import { execAgressiveBuy } from 'shared/actions'

const { ACCOUNT } = process.env

export default function* ordersSaga(): any {
  while (true) {
    const { payload: { symbol, amount, price } } = yield take(execAgressiveBuy)
    const order = [ 0, 'on', null, {
      gid: 1,
      cid: null,
      type: 'EXCHANGE LIMIT',
      symbol: symbol,
      amount: `${amount}`,
      price: `${price}`,
      hidden: 0
    } ]
  }
}
