import debug from 'debug'
import { call, put, select } from 'redux-saga/effects'

import { execNewOrder } from 'shared/actions'
import {
  selectAmountToSell, selectAmountToBuy, selectCurrentPrice,
  selectHighestBids, selectLowestAsks
} from 'shared/sagas/selectors'

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

export function* doBuySaga(symbol: string, stoch: number) {
  const [ ask, reserveAsk ] = yield select(selectLowestAsks)
  const chunkAmount = yield call(getChunkAmount, symbol, stoch)
  const amount = chunkAmount < 0.005 ? 0.005 : chunkAmount
  const price = ask[2] >= amount * 2 ? ask[0] : reserveAsk[0]

  // yield put(execNewOrder({ symbol, amount, price }))
  debug('worker')(`Exchange ${amount} for ${price} of ${symbol}`)
}

export function* doSellSaga(symbol: string, stoch: number) {
  const [ bid, reserveBid ] = yield select(selectHighestBids)
  const chunkAmount = yield call(getChunkAmount, symbol, stoch)
  const amount = -(chunkAmount < 0.005 ? 0.005 : chunkAmount)
  const price = bid[2] >= amount * 2 ? bid[0] : reserveBid[0]

  // yield put(execNewOrder({ symbol, price, amount: -amount }))
  debug('worker')(`Exchange ${-amount} for ${price} of ${symbol}`)
}
