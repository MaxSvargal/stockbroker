import { call, take, put, select, fork, race } from 'redux-saga/effects'
import { selectWallet, selectChunkedCurrency, selectCurrentPair } from 'sagas/selectors'
import Poloniex from 'services/poloniex'
import { CURRENT_PAIR } from 'const'
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
  setFreeCurrencyIsset,
  updateWallet
} from 'actions'

// my
const key = 'I94AGT6H-HEUAIL5B-G34YF99I-IYR0777F'
const secret = '758c86f9c922e164f573801663f641acb625e4118f646f0b5612da38cd18a171716d580af12104c3719b935b2cf1510f6df3359e28f403e9bf32e2cbe2faa97f'

/* eslint max-len: 0 */
// pa
// const key = 'CMF66JGJ-9PJOIUPU-EFUCU5Y1-A2LEC3UF'
// const secret = 'e1ceb16dc61f209cc00d8c6f08c3285a099242faaebb889eadf14a528e9517ca4e148ca7b17e3f86f49590f306c6c903defbeb5cfa1ac6168d3e36276404693b'

export const poloniex = new Poloniex({ key, secret })

const makeChunks = (rate, amount, chunksNum) => {
  /* eslint no-plusplus: 0 */
  let quantity = chunksNum
  const chunks = []
  while (quantity--) chunks.push([ rate, amount ])
  return chunks
}

export function* watchForNewChunks() {
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

export function* getWallet() {
  const { response } = yield call(poloniex.privateRequest, { command: 'returnBalances' })
  yield put(updateWallet(response))
}

export function* doBuySaga() {
  while (true) {
    try {
      const { payload: [ rate, amount ] } = yield take(doBuy)
      const options = { command: 'buy', currencyPair: CURRENT_PAIR, rate, amount }
      const { response } = yield call(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield put(buySuccess([ rate, amount, response.orderNumber ])) :
        yield put(buyFailure([ rate, amount, response.error ]))
        // TODO: сообщить боту об ошибке в чат
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
      const { response } = yield call(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield put(sellSuccess([ rate, amount, response.orderNumber ])) :
        yield put(sellFailure([ rate, amount, response.error ]))
        // TODO: сообщить боту об ошибке в чат
    } catch (err) {
      console.log({ err })
    }
  }
}

export function* chunksCreator() {
  const { payload: [ name ] } = yield take(setCurrency)

  const pairNames = name.split('_')
  const wallet = yield select(selectWallet)

  yield call(checkFreeValues, pairNames, wallet)
}

export default function* walletSaga() {
  yield [
    fork(getWallet),
    fork(watchForNewChunks),
    fork(chunksCreator),
    fork(doBuySaga),
    fork(doSellSaga)
  ]
}
