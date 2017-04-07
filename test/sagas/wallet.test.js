import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import { calculateFreeValues, getWallet, watchForNewChunks, checkFreeValues, doBuySaga, doSellSaga, poloniex } from 'server/sagas/wallet'
import { selectWallet, selectCurrentPair, selectUncoveredSells, selectUncoveredBuys, selectCurrencyPair, selectCurrencyPairSplited } from 'server/sagas/selectors'
import { CURRENT_PAIR } from 'const'
import {
  setFreeCurrencies, updateWallet, setCurrency, convertCurrencyToChunks,
  doBuy, doSell, sellSuccess, sellFailure, buySuccess, buyFailure
} from 'shared/actions'

// const repeat = (num, item) => {
//   const arr = []
//   let index = num
//   /* eslint no-plusplus: 0 */
//   while (index--) arr.push(item)
//   return arr
// }

test.todo('watchForNewChunks should create chunks correctly')

test('getWallet should request currencies from poloniex immediately', () =>
  testSaga(getWallet)
    .next()
    .call(poloniex.privateRequest, { command: 'returnBalances' })
    .next({ response: { USDT: '40.5', ETH: '1' } })
    .put(updateWallet({ USDT: '40.5', ETH: '1' }))
    .next()
    .isDone())

test.skip('calculateFreeValues should set free currencies', () =>
  testSaga(calculateFreeValues)
    .next()
    .take(setCurrency)
    .next({ payload: [ 'USDT_ETH', '40.5' ] })
    .select(selectCurrencyPairSplited)
    .next([ 'USDT', 'BTC' ])
    .select(selectWallet)
    .next({ USDT: 2, ETH: 1, BTC: 1000 })
    .select(selectUncoveredSells)
    .next([ [ 0, 40.5, 0.0002, -1, 0 ], [ 1, 40.5, 0.0003, -1, 0 ] ])
    .select(selectUncoveredBuys)
    .next([ [ 0, 40.5, 0.00000005, -1, 0 ], [ 1, 40.5, 0.00000006, -1, 0 ] ])
    .put(setFreeCurrencies([ 1.9995, 999.99999989 ]))
    .next()
    .isDone())

test('doBuySaga should work correctly', () =>
  testSaga(doBuySaga)
    .next()
    .take(doBuy)
    .next({ payload: { rate: 40.5, amount: 0.0007, profit: 0.00015, coverId: 99 } })
    .select(selectCurrencyPair)
    .next('BTC_ETH')
    .call(poloniex.privateRequest, { command: 'buy', currencyPair: 'BTC_ETH', rate: 40.5, amount: 0.0007 })
    .next({ response: { orderNumber: '257473046371' } })
    .put(buySuccess({ rate: 40.5, amount: 0.0007, profit: 0.00015, coverId: 99, orderNumber: '257473046371' }))
    .next()
    .take(doBuy))

test('doBuySaga should store error', () =>
  testSaga(doBuySaga)
    .next()
    .take(doBuy)
    .next({ payload: { rate: 40.5, amount: 0.0007, coverId: 99 } })
    .select(selectCurrencyPair)
    .next('BTC_ETH')
    .call(poloniex.privateRequest, { command: 'buy', currencyPair: 'BTC_ETH', rate: 40.5, amount: 0.0007 })
    .next({ response: { error: 'Not enough money' } })
    .put(buyFailure({ rate: 40.5, amount: 0.0007, coverId: 99, error: 'Not enough money' })))

test('doSellSaga should work correctly', () =>
  testSaga(doSellSaga)
    .next()
    .take(doSell)
    .next({ payload: { rate: 40.5, amount: 0.0007, profit: 0.00015, coverId: 99 } })
    .select(selectCurrencyPair)
    .next('BTC_ETH')
    .call(poloniex.privateRequest, { command: 'sell', currencyPair: 'BTC_ETH', rate: 40.5, amount: 0.0007 })
    .next({ response: { orderNumber: '257473046371' } })
    .put(sellSuccess({ rate: 40.5, amount: 0.0007, profit: 0.00015, coverId: 99, orderNumber: '257473046371' }))
    .next()
    .take(doSell))

test('doSellSaga should store error', () =>
  testSaga(doSellSaga)
    .next()
    .take(doSell)
    .next({ payload: { rate: 40.5, amount: 0.0007, coverId: 99 } })
    .select(selectCurrencyPair)
    .next('BTC_ETH')
    .call(poloniex.privateRequest, { command: 'sell', currencyPair: 'BTC_ETH', rate: 40.5, amount: 0.0007 })
    .next({ response: { error: 'Not enough money' } })
    .put(sellFailure({ rate: 40.5, amount: 0.0007, coverId: 99, error: 'Not enough money' }))
    .next()
    .take(doSell))

// test('calculateFreeValues should return correct free currencies', () =>
//   testSaga(calculateFreeValues)
//     .next())
