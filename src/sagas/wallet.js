import { call, take, put, select, fork, race } from 'redux-saga/effects'
import Poloniex from 'services/poloniex'
import { cropNumber } from 'utils'
import { CURRENT_PAIR } from 'const'

import {
  selectWallet,
  selectCurrentPair,
  selectCurrencyPair,
  selectUncoveredSells,
  selectUncoveredBuys
} from 'sagas/selectors'

import {
  addBuyChunks,
  addChunkedCurrency,
  addSellChunks,
  botMessage,
  buyFailure,
  buySuccess,
  doBuy,
  doSell,
  sellFailure,
  sellSuccess,
  sendBuys,
  sendSells,
  setCurrency,
  setFreeCurrencies,
  updateWallet
} from 'actions'

const { ACCOUNT: { key, secret } } = process.env
export const poloniex = new Poloniex({ key, secret })

export function* watchForNewChunks() {
  const makeChunks = (rate, amount, chunksNum) => {
    /* eslint no-plusplus: 0 */
    let quantity = chunksNum
    const chunks = []
    while (quantity--) chunks.push([ rate, amount ])
    return chunks
  }

  while (true) {
    const { sellChunks, buyChunks } = yield race({
      sellChunks: take(sendSells),
      buyChunks: take(sendBuys)
    })

    const [ firstCurrency, secondCurrency ] = yield select(selectCurrentPair)

    if (sellChunks) {
      const { rate, amount, chunksNum } = sellChunks.payload
      const chunksToSell = makeChunks(rate, amount, chunksNum)

      yield put(addSellChunks(chunksToSell))
      yield put(addChunkedCurrency([ firstCurrency, amount * chunksNum ]))
      yield put(botMessage(`Созданы продажи в количестве ${chunksNum} частей по ${amount} ${secondCurrency}`))
    } else if (buyChunks) {
      const { rate, amount, chunksNum } = buyChunks.payload
      const chunksToBuy = makeChunks(rate, amount, chunksNum)

      yield put(addBuyChunks(chunksToBuy))
      yield put(addChunkedCurrency([ secondCurrency, amount * chunksNum ]))
      yield put(botMessage(`Созданы покупки в количестве ${chunksNum} частей по ${amount} ${secondCurrency}`))
    }
  }
}

export function* doBuySaga() {
  while (true) {
    try {
      const { payload: [ rate, amount, coverIndex ] } = yield take(doBuy)
      const options = { command: 'buy', currencyPair: CURRENT_PAIR, rate, amount }
      const { response, error } = yield call(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield put(buySuccess([ rate, amount, coverIndex, response.orderNumber ])) :
        yield put(buyFailure([ rate, amount, error || response.error ]))
    } catch (err) {
      console.log({ err })
    }
  }
}

export function* doSellSaga() {
  while (true) {
    try {
      const { payload: [ rate, amount, coverIndex ] } = yield take(doSell)
      const options = { command: 'sell', currencyPair: CURRENT_PAIR, rate, amount }
      const { response, error } = yield call(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield put(sellSuccess([ rate, amount, coverIndex, response.orderNumber ])) :
        yield put(sellFailure([ rate, amount, error || response.error ]))
    } catch (err) {
      console.log({ err })
    }
  }
}

export function* getWallet() {
  const { response } = yield call(poloniex.privateRequest, { command: 'returnBalances' })
  yield put(updateWallet(response))
}

export function* calculateFreeValues() {
  while (true) {
    yield take([ setCurrency, sendBuys, sendSells ])

    const [ firstCurrency, secondCurrency ] = yield select(selectCurrentPair)
    const { last } = yield select(selectCurrencyPair)
    const wallet = yield select(selectWallet)
    const uncoveredSells = yield select(selectUncoveredSells)
    const uncoveredBuys = yield select(selectUncoveredBuys)

    const volumeOfSellChunks = uncoveredSells.reduce((prev, curr) =>
      (curr[4] === 0 ? prev + curr[2] : prev), 0)

    const volumeOfBuyChunks = uncoveredBuys.reduce((prev, curr) =>
      (curr[4] === 0 ? prev + curr[2] : prev), 0)

    const firstFreeVolume = cropNumber((wallet[firstCurrency] - volumeOfSellChunks) * last)
    const secondFreeVolume = cropNumber(wallet[secondCurrency] - volumeOfBuyChunks)

    yield put(setFreeCurrencies([ firstFreeVolume, secondFreeVolume ]))
  }
}

export default function* walletSaga() {
  yield [
    fork(getWallet),
    fork(watchForNewChunks),
    fork(calculateFreeValues),
    fork(doBuySaga),
    fork(doSellSaga)
  ]
}
