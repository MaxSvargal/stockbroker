import { call, take, put, select, fork } from 'redux-saga/effects'
import Poloniex from 'server/services/poloniex'
import { selectCurrencyPair, selectCurrencyPairSplited } from 'server/sagas/selectors'
import {
  addChunks,
  botMessage,
  buyFailure,
  buySuccess,
  doBuy,
  doSell,
  requestNewChunks,
  sellFailure,
  sellSuccess,
  setCurrencyPair,
  updateWallet
} from 'shared/actions'

const { CURRENCY_PAIR, ACCOUNT: { key, secret } } = process.env
export const poloniex = new Poloniex({ key, secret })

export function* setCurrencyPairSaga() {
  yield put(setCurrencyPair(CURRENCY_PAIR))
}

export function* watchForNewChunks() {
  while (true) {
    const { payload: { type, num, rate, amount } } = yield take(requestNewChunks)
    const [ , currency ] = yield select(selectCurrencyPairSplited)

    yield put(addChunks({ type, num, rate, amount }))
    yield put(botMessage(`
      Созданы ${type === 'buy' ? 'покупки' : 'продажи'} за ${rate} в количестве ${num} частей по ${amount} ${currency}
    `))
  }
}

export function* doBuySaga() {
  while (true) {
    try {
      const { payload: { rate, amount, profit, coverId } } = yield take(doBuy)
      const currencyPair = yield select(selectCurrencyPair)
      const options = { command: 'buy', currencyPair, rate, amount }
      // const { response, error } = yield call(poloniex.privateRequest, options)
      const { response, error } = { response: { orderNumber: 777 } }
      const orderNumber = response && response.orderNumber

      orderNumber ?
        yield put(buySuccess({ rate, amount, profit, coverId, orderNumber })) :
        yield put(buyFailure({ rate, amount, coverId, error: error || (response && response.error) }))
    } catch (err) {
      console.log({ err })
    }
  }
}

export function* doSellSaga() {
  while (true) {
    try {
      const { payload: { rate, amount, profit, coverId } } = yield take(doSell)
      const currencyPair = yield select(selectCurrencyPair)
      const options = { command: 'sell', currencyPair, rate, amount }
      // const { response, error } = yield call(poloniex.privateRequest, options)
      const { response, error } = { response: { orderNumber: 777 } }
      const orderNumber = response && response.orderNumber

      orderNumber ?
        yield put(sellSuccess({ rate, amount, profit, coverId, orderNumber })) :
        yield put(sellFailure({ rate, amount, coverId, error: error || (response && response.error) }))
    } catch (err) {
      console.log({ err })
    }
  }
}

export function* getWallet() {
  const { response } = yield call(poloniex.privateRequest, { command: 'returnBalances' })
  yield put(updateWallet(response))
}

// TODO
// export function* calculateFreeValues() {
//   while (true) {
//     yield take([ setCurrency, sendBuys, sendSells ])
//
//     const [ firstCurrency, secondCurrency ] = yield select(selectCurrentPair)
//     const { last } = yield select(selectCurrencyPair)
//     const wallet = yield select(selectWallet)
//     const uncoveredSells = yield select(selectUncoveredSells)
//     const uncoveredBuys = yield select(selectUncoveredBuys)
//
//     const volumeOfSellChunks = uncoveredSells.reduce((prev, curr) =>
//       (curr[4] === 0 ? prev + curr[2] : prev), 0)
//
//     const volumeOfBuyChunks = uncoveredBuys.reduce((prev, curr) =>
//       (curr[4] === 0 ? prev + curr[2] : prev), 0)
//
//     const firstFreeVolume = cropNumber((wallet[firstCurrency] - volumeOfSellChunks) * last)
//     const secondFreeVolume = cropNumber(wallet[secondCurrency] - volumeOfBuyChunks)
//
//     yield put(setFreeCurrencies([ firstFreeVolume, secondFreeVolume ]))
//   }
// }

export default function* walletSaga() {
  yield [
    fork(setCurrencyPairSaga),
    fork(getWallet),
    fork(watchForNewChunks),
    // fork(calculateFreeValues),
    fork(doBuySaga),
    fork(doSellSaga)
  ]
}
