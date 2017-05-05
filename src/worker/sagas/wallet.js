import { delay } from 'redux-saga'
import { all, call, race, take, put, select, fork } from 'redux-saga/effects'
import { addChunks, buyFailure, buySuccess, doBuy, doSell, sellFailure, sellSuccess, setCurrencyPair, updateWallet, setBalanceValues, addMessage } from '../../shared/actions'
import PoloniexPrivate from '../services/poloniexPrivate'
import { selectCurrencyPair, selectVolumeOfChunksType, selectCurrencyPairSplited, selectAvaliableValue } from './selectors'

const { CURRENCY_PAIR, ACCOUNT_KEY, ACCOUNT_SECRET } = process.env

export const poloniex = new PoloniexPrivate({ key: ACCOUNT_KEY, secret: ACCOUNT_SECRET })

export function* setCurrencyPairSaga() {
  yield put(setCurrencyPair(CURRENCY_PAIR))
}

export function* getWalletSaga() {
  try {
    const { response, error } = yield call(poloniex.privateRequest, { command: 'returnBalances' })
    if (error) throw new Error('Fail to get wallet balance.', error)
    if (response) {
      const cleanedWallet = Object.keys(response).reduce((prev, key) =>
        Number(response[key]) === 0 ? prev :
          Object.assign({}, prev, { [key]: response[key] }), {})
      yield put(updateWallet(cleanedWallet))
    }
    yield delay(60000)
    yield fork(getWalletSaga)
  } catch (err) {
    yield put(addMessage('error', `getWalletSaga: ${err}`))
    yield delay(60000)
    yield fork(getWalletSaga)
  }
}

export function* calculateFreeValues() {
  while (true) {
    yield take([ addChunks, buySuccess, buyFailure, sellSuccess, sellFailure ])
    const chunksBuyVolume = yield select(selectVolumeOfChunksType, 'buy')
    const chunksSellVolume = yield select(selectVolumeOfChunksType, 'sell')

    // const [ firstCurrency, seconndCurrency ] = yield select(selectCurrencyPairSplited)
    const availableBuyValue = 0.20 // yield select(selectAvaliableValue, firstCurrency)
    const availableSellValue = 3.2 // yield select(selectAvaliableValue, seconndCurrency)

    yield put(setBalanceValues({ chunksBuyVolume, chunksSellVolume, availableBuyValue, availableSellValue }))
  }
}

export function* carryOutTransactionsSaga() {
  try {
    const { buy, sell } = yield race({ buy: take(doBuy), sell: take(doSell) })
    const currencyPair = yield select(selectCurrencyPair)

    const { rate, amount, profit, coverId } = (buy && buy.payload) || (sell && sell.payload)
    const command = (buy && 'buy') || (sell && 'sell')
    const successCb = (buy && buySuccess) || (sell && sellSuccess)
    const failureCb = (buy && buyFailure) || (sell && sellFailure)
    const options = { command, currencyPair, rate, amount }

    const { response, error } = yield call(poloniex.privateRequest, options)
    const orderNumber = response && response.orderNumber

    orderNumber ?
      yield put(successCb({ rate, amount, profit, coverId, orderNumber })) :
      yield put(failureCb({ rate, amount, coverId, error: error || (response && response.error) }))
  } catch (err) {
    console.log({ err })
  }
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
  yield all([
    fork(setCurrencyPairSaga),
    fork(carryOutTransactionsSaga),
    fork(calculateFreeValues),
    fork(getWalletSaga)
  ])
}
