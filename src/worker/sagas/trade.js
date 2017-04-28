import { take, select, put, race } from 'redux-saga/effects'
import { cropNumber } from '../../shared/utils'
import { addMessage, doBuy, doSell, buySuccess, buyFailure, sellSuccess, sellFailure, addChunks } from '../../shared/actions'
import { selectSellForCover, selectBuyForCover, selectTransactions, selectAutocreatedChunkAmount } from './selectors'

export function* buySaga(rate, hold) {
  const transactions = yield select(selectTransactions)
  const rateWithHold = cropNumber(rate + hold)
  const coverId = yield select(selectSellForCover, rateWithHold)
  if (!coverId) {
    const chunkAmount = yield select(selectAutocreatedChunkAmount)
    if (chunkAmount !== 0)
      yield put(addChunks({ rate, amount: chunkAmount, num: 1, type: 'buy', creationMethod: 'hollow' }))
    yield put(addMessage('failure', { type: 'buy', rate: rateWithHold }))
    return false
  }

  const covered = transactions[coverId]
  const profit = cropNumber((covered.rate - rate) * (covered.amount - (covered.amount * 0.25)))

  yield put(doBuy({ rate, amount: covered.amount, profit, coverId }))
  const response = yield race({ success: take(buySuccess), failure: take(buyFailure) })

  if (response.success)
    yield put(addMessage('transaction', { type: 'buy', rate, coveredRate: covered.rate, coveredAmount: covered.amount, profit }))
  else if (response.failure)
    yield put(addMessage('error', { type: 'buy', error: response.failure.payload.error }))
}

export function* sellSaga(rate, hold) {
  const transactions = yield select(selectTransactions)
  const rateWithHold = cropNumber(rate - hold)
  const coverId = yield select(selectBuyForCover, rateWithHold)
  if (!coverId) {
    const chunkAmount = yield select(selectAutocreatedChunkAmount)
    if (chunkAmount !== 0)
      yield put(addChunks({ rate, amount: chunkAmount, num: 1, type: 'sell', creationMethod: 'hollow' }))
    yield put(addMessage('failure', { type: 'sell', rate: rateWithHold }))
    return false
  }

  const covered = transactions[coverId]
  const profit = cropNumber((rate - covered.rate) * (covered.amount - (covered.amount * 0.25)))

  yield put(doSell({ rate, amount: covered.amount, profit, coverId }))
  const response = yield race({ success: take(sellSuccess), failure: take(sellFailure) })

  if (response.success)
    yield put(addMessage('transaction', { type: 'sell', rate, coveredRate: covered.rate, coveredAmount: covered.amount, profit }))
  else if (response.failure)
    yield put(addMessage('error', { type: 'sell', error: response.failure.payload.error }))
}
