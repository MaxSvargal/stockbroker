import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import { getWallet, chunksCreator, checkFreeValues, doBuySaga, doSellSaga, poloniex } from 'sagas/wallet'
import { selectWallet, selectChunkedCurrency, selectChunksNumber } from 'sagas/selectors'
import { CURRENT_PAIR } from 'const'
import {
  addSellChunks, addBuyChunks, addChunkedCurrency,
  updateWallet, setCurrency, convertCurrencyToChunks,
  setFreeCurrencyIsset, doBuy, doSell, sellSuccess, sellFailure, buySuccess, buyFailure
} from 'actions'

const repeat = (num, item) => {
  const arr = []
  let index = num
  /* eslint no-plusplus: 0 */
  while (index--) arr.push(item)
  return arr
}

test('getWallet should request currencies from poloniex immediately', () =>
  testSaga(getWallet)
    .next()
    .call(poloniex.privateRequest, { command: 'returnBalances' })
    .next({ response: { USDT: '40.5', ETH: '1' } })
    .put(updateWallet({ USDT: '40.5', ETH: '1' }))
    .next()
    .isDone())


test('chunksCreator should create chunks for every minute of a day', () =>
  testSaga(chunksCreator)
    .next()
    .take(setCurrency)
    .next({ payload: [ 'USDT_ETH', '40.5' ] })
    .select(selectWallet)
    .next({ USDT: 40.5, ETH: 1, BTC: 100 })
    .call(checkFreeValues, [ 'USDT', 'ETH' ], { USDT: 40.5, ETH: 1, BTC: 100 })
    .next([ 40.5, 1 ])
    .take(convertCurrencyToChunks)
    .next()
    .select(selectChunksNumber)
    .next(24)
    .put(addSellChunks(repeat(24, [ 40.5, 0.04166666 ])))
    .next()
    .put(addChunkedCurrency([ 'USDT', 40.5 ]))
    .next()
    .put(addBuyChunks(repeat(24, [ 40.5, 0.04166666 ])))
    .next()
    .put(addChunkedCurrency([ 'ETH', 1 ]))
    .next()
    .isDone())

test('chunksCreator should not create chunks if no free values', () =>
  testSaga(chunksCreator)
    .next()
    .take(setCurrency)
    .next({ payload: [ 'USDT_ETH', '40.5' ] })
    .select(selectWallet)
    .next({ USDT: 40.5, ETH: 1, BTC: 100 })
    .call(checkFreeValues, [ 'USDT', 'ETH' ], { USDT: 40.5, ETH: 1, BTC: 100 })
    .next([ 0, 0 ])
    .take(convertCurrencyToChunks)
    .next()
    .select(selectChunksNumber)
    .next(12)
    .isDone())

test('checkFreeValues should return unused currency positive status', () =>
  testSaga(checkFreeValues, [ 'USDT', 'ETH' ], { USDT: 10, ETH: 5, BTC: 100 })
    .next()
    .select(selectChunkedCurrency)
    .next([])
    .put(setFreeCurrencyIsset([ 10, 5 ]))
    .next([ 2, 2 ])
    .isDone())

test('checkFreeValues should return unused currency negative status', () =>
  testSaga(checkFreeValues, [ 'USDT', 'ETH' ], { USDT: 10, ETH: 5, BTC: 100 })
    .next()
    .select(selectChunkedCurrency)
    .next([ [ 'USDT', 10 ], [ 'ETH', 5 ] ])
    .put(setFreeCurrencyIsset([ 0, 0 ]))
    .next([ 2, 2 ])
    .isDone())

test('checkFreeValues should return false if no suitable values', () =>
  testSaga(checkFreeValues, [ 'USDT', 'ETH' ], { USDT: 15, ETH: 9, BTC: 100 })
    .next()
    .select(selectChunkedCurrency)
    .next([ [ 'USDT', 10 ], [ 'ETH', 5 ], [ 'USDT', 3 ], [ 'ETH', 2 ] ])
    .put(setFreeCurrencyIsset([ 2, 2 ]))
    .next([ 2, 2 ])
    .isDone())

test('doBuySaga should work correctly', () =>
  testSaga(doBuySaga)
    .next()
    .take(doBuy)
    .next({ payload: [ 40.5, 0.0007 ] })
    .call(poloniex.privateRequest, { command: 'buy', currencyPair: CURRENT_PAIR, rate: 40.5, amount: 0.0007 })
    .next({ response: { orderNumber: '257473046371' } })
    .put(buySuccess([ 40.5, 0.0007, '257473046371' ]))
    .next()
    .take(doBuy))

test('doBuySaga should store error', () =>
  testSaga(doBuySaga)
    .next()
    .take(doBuy)
    .next({ payload: [ 40.5, 0.0007 ] })
    .call(poloniex.privateRequest, { command: 'buy', currencyPair: CURRENT_PAIR, rate: 40.5, amount: 0.0007 })
    .next({ error: 'Not enough money' })
    .put(buyFailure([ 40.5, 0.0007, 'Not enough money' ])))

test('doSellSaga should work correctly', () =>
  testSaga(doSellSaga)
    .next()
    .take(doSell)
    .next({ payload: [ 40.5, 0.0007 ] })
    .call(poloniex.privateRequest, { command: 'sell', currencyPair: CURRENT_PAIR, rate: 40.5, amount: 0.0007 })
    .next({ response: { orderNumber: '257473046371' } })
    .put(sellSuccess([ 40.5, 0.0007, '257473046371' ]))
    .next()
    .take(doSell))

test('doSellSaga should store error', () =>
  testSaga(doSellSaga)
    .next()
    .take(doSell)
    .next({ payload: [ 40.5, 0.0007 ] })
    .call(poloniex.privateRequest, { command: 'sell', currencyPair: CURRENT_PAIR, rate: 40.5, amount: 0.0007 })
    .next({ error: 'Not enough money' })
    .put(sellFailure([ 40.5, 0.0007, 'Not enough money' ]))
    .next()
    .take(doSell))
