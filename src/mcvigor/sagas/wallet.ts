import debug from 'debug'
import { call, put, select, take } from 'redux-saga/effects'
import { __, curry, subtract, multiply, add, reduce, prop, nth } from 'ramda'

import { PositionPayload } from 'shared/types'
import { now } from 'shared/lib/helpers'
import { execNewOrder, createPosition, updateMyTrade } from 'shared/actions'
import {
  selectAmountToSell, selectAmountToBuy, selectCurrentPrice,
  selectHighestBids, selectLowestAsks
} from 'shared/sagas/selectors'

const getProfit = curry((buyFor: number, sellFor: number, amount: number, fee: number) =>
  subtract(
    multiply(amount, subtract(sellFor, buyFor)),
    add(
      reduce(multiply, 1, [ buyFor, amount, fee ]),
      reduce(multiply, 1, [ sellFor, amount, fee ])
    )
  )
)

export function getChunkAmountForStochastic(fullAmount: number, stochastic: number) {
  const stochPerc = stochastic / 100
  const stochKVal = stochPerc > 0.5 ? stochPerc : 1 - stochPerc
  const numOfChunks = 12
  const multiplier = 4
  const stabilizer = 1

  const chunkAmount = (fullAmount / (numOfChunks * 2)) * ((stochKVal * multiplier) - stabilizer)
  return Math.round(chunkAmount * 1e4) / 1e4
}

export function* getChunkAmount(symbol: string, stoch: number) {
  const amountToSell = yield select(selectAmountToSell, symbol)
  const amountToBuy = yield select(selectAmountToBuy, symbol)
  const currentPrice = yield select(selectCurrentPrice, symbol)
  const fullAmount = amountToSell + (amountToBuy / currentPrice)
  return getChunkAmountForStochastic(fullAmount, stoch)
}

export function* doBuySaga(symbol: string, time = now()) {
  const [ ask, reserveAsk ] = yield select(selectLowestAsks)
  const chunkAmount = 0.005 // yield call(getChunkAmount, symbol, stoch)
  const amount = chunkAmount < 0.005 ? 0.005 : chunkAmount
  const price = ask[2] >= amount * 2 ? ask[0] : reserveAsk[0]

  yield put(execNewOrder({ symbol, amount, price }))
  // const { payload } = yield take(updateMyTrade)
  // const [ id, mts ] = [ nth(0, payload), nth(4, payload) ]
  // await for cid and mts?
  yield put(createPosition({ symbol, price, amount, cid: 0, id: time, mts: time }))
  debug('worker')(`Exchange ${amount} for ${price} of ${symbol}`)
}

export function* doSellSaga(symbol: string, coverPos: PositionPayload) {
  const [ bid, reserveBid ] = yield select(selectHighestBids)
  const coverProp = prop(__, coverPos)
  // const chunkAmount = -0.005 // yield call(getChunkAmount, symbol, stoch)
  const amount = coverProp('amount')
  const price = bid[2] >= amount * 2 ? bid[0] : reserveBid[0]
  const profit = getProfit(coverProp('price'))(price)(amount)(0.002)

  yield put(execNewOrder({ symbol, price, amount: -amount }))
  // const { payload } = yield take(updateMyTrade)
  // const [ id, mts ] = [ nth(0, payload), nth(4, payload) ]
  // [ ID, GID, CID, SYMBOL, MTS_CREATE, MTS_UPDATE, AMOUNT, AMOUNT_ORIG, TYPE, TYPE_PREV, FLAGS, ORDER_STATUS, PRICE, PRICE_AVG, PRICE_TRAILING, PRICE_AUX_LIMIT, NOTIFY, HIDDEN, PLACED_ID ]
  // TODO: await for cid, mts, fee(profit), coverPrice(profit) ?
  // yield take(createOrder)
  // id as sha hash?
  yield put(createPosition({ symbol, price, amount: -amount, profit, cid: 0, id: now(), mts: now(), covered: [ coverProp('id') ] }))
  debug('worker')(`Exchange ${-amount} for ${price} of ${symbol}, covered ${coverProp('price')}, profit ${profit}`)
}
