import { call, take, put, select, fork } from 'redux-saga/effects'
import { selectWallet, selectChunkedCurrency, selectChunksNumber } from 'sagas/selectors'
import Poloniex from 'services/poloniex'
import { CURRENT_PAIR } from 'const'
import {
  setCurrency, addSellChunks, addBuyChunks, addChunkedCurrency,
  updateWallet, convertCurrencyToChunks, setFreeCurrencyIsset,
  doBuy, doSell, sellSuccess, sellFailure, buySuccess, buyFailure
} from 'actions'

const key = 'I94AGT6H-HEUAIL5B-G34YF99I-IYR0777F'
const secret = '758c86f9c922e164f573801663f641acb625e4118f646f0b5612da38cd18a171716d580af12104c3719b935b2cf1510f6df3359e28f403e9bf32e2cbe2faa97f'

export const poloniex = new Poloniex({ key, secret })

const makeChunks = (rate, value, numOfParts = 12) => {
  const perChunk = Number((value / numOfParts).toString().slice(0, 10))
  let numOfChunks = Math.round(value / perChunk)
  const chunks = []
  /* eslint no-plusplus: 0 */
  while (numOfChunks--) chunks.push([ rate, perChunk ])
  return chunks
}

export function* checkFreeValues(pairNames, wallet) {
  const chunkedCurrency = yield select(selectChunkedCurrency)

  const firstCurrInWallet = wallet[pairNames[0]]
  const firstCurrUsed = chunkedCurrency.reduce((prev, curr) =>
    (curr[0] === pairNames[0] ? prev + curr[1] : prev), 0)
  const firstCurrDiff = firstCurrInWallet - firstCurrUsed

  const secondCurrInWallet = wallet[pairNames[1]]
  const secondCurrUsed = chunkedCurrency.reduce((prev, curr) =>
    (curr[0] === pairNames[1] ? prev + curr[1] : prev), 0)
  const secondCurrDiff = secondCurrInWallet - secondCurrUsed

  const output = [ firstCurrDiff, secondCurrDiff ]

  yield put(setFreeCurrencyIsset(output))
  return output
}

export function* chunksCreator() {
  const { payload: [ name, rate ] } = yield take(setCurrency)

  const pairNames = name.split('_')
  const wallet = yield select(selectWallet)

  const [ firstUnusedVolume, secondUnusedVolume ] = yield call(checkFreeValues, pairNames, wallet)
  // wait for convert action
  yield take(convertCurrencyToChunks)

  const chunksNumber = yield select(selectChunksNumber)

  // usd
  if (firstUnusedVolume > 0) {
    const benchValue = Number(firstUnusedVolume) / Number(rate)
    const chunksToSell = makeChunks(Number(rate), benchValue, chunksNumber)
    yield put(addSellChunks(chunksToSell))
    yield put(addChunkedCurrency([ pairNames[0], Number(firstUnusedVolume) ]))
  }

  // eth
  if (secondUnusedVolume > 0) {
    const chunksToBuy = makeChunks(Number(rate), Number(secondUnusedVolume), chunksNumber)
    yield put(addBuyChunks(chunksToBuy))
    yield put(addChunkedCurrency([ pairNames[1], Number(secondUnusedVolume) ]))
  }
}

export function* getWallet() {
  const { response } = yield call(poloniex.privateRequest, { command: 'returnBalances' })
  yield put(updateWallet(response))
}

export function* doBuySaga() {
  while (true) {
    try {
      const { payload: [ rate, amount ] } = yield take(doBuy)
      const options = { command: 'buy', currencyPair: CURRENT_PAIR, rate, amount }
      const { response, error } = yield call(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield put(buySuccess([ rate, amount, response.orderNumber ])) :
        yield put(buyFailure([ rate, amount, error ]))
    } catch (err) {
      console.log({ err })
    }
  }
}

export function* doSellSaga() {
  while (true) {
    try {
      const { payload: [ rate, amount ] } = yield take(doSell)
      const options = { command: 'sell', currencyPair: CURRENT_PAIR, rate, amount }
      const { response, error } = yield call(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield put(sellSuccess([ rate, amount, response.orderNumber ])) :
        yield put(sellFailure([ rate, amount, error ]))
    } catch (err) {
      console.log({ err })
    }
  }
}

export default function* walletSaga() {
  yield [
    fork(getWallet),
    fork(chunksCreator),
    fork(doBuySaga),
    fork(doSellSaga)
  ]
}
