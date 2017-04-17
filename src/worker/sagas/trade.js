import { take, select, put, race } from 'redux-saga/effects'
import { cropNumber } from '../../shared/utils'
import { doBuy, doSell, botMessage, buySuccess, buyFailure, sellSuccess, sellFailure, requestNewChunks } from '../../shared/actions'
import { selectSellForCover, selectBuyForCover, selectTransactions, selectAutocreatedChunkAmount } from './selectors'

export function* buySaga(rate, hold) {
  const transactions = yield select(selectTransactions)
  const rateWithHold = cropNumber(rate + hold)
  const coverId = yield select(selectSellForCover, rateWithHold)
  if (!coverId) {
    const chunkAmount = yield select(selectAutocreatedChunkAmount)
    // yield put(botMessage(`Покупка за ${rateWithHold} не покрывает ни одной продажи`))
    if (chunkAmount !== 0)
      yield put(requestNewChunks({ rate, amount: chunkAmount, num: 1, type: 'buy', creationMethod: 'hollow' }))
    return false
  }

  const covered = transactions[coverId]
  const profit = cropNumber((covered.rate - rate) * (covered.amount - (covered.amount * 0.25)))

  yield put(doBuy({ rate, amount: covered.amount, profit, coverId }))
  const response = yield race({ success: take(buySuccess), failure: take(buyFailure) })

  if (response.success) yield put(botMessage(`Куплено за ${rate}, покрыто ${covered.rate}, объём ${covered.amount}, прибыль ${profit}`))
  else if (response.failure) yield put(botMessage(`Покупка не удалась. Ошибка: ${response.failure.payload.error}`))
}

export function* sellSaga(rate, hold) {
  const transactions = yield select(selectTransactions)
  const rateWithHold = cropNumber(rate - hold)
  const coverId = yield select(selectBuyForCover, rateWithHold)
  if (!coverId) {
    const chunkAmount = yield select(selectAutocreatedChunkAmount)
    if (chunkAmount !== 0)
      yield put(requestNewChunks({ rate, amount: chunkAmount, num: 1, type: 'sell', creationMethod: 'hollow' }))
    // yield put(botMessage(`Продажа за ${rateWithHold} не покрывает ни одной покупки`))
    return false
  }

  const covered = transactions[coverId]
  const profit = cropNumber((rate - covered.rate) * (covered.amount - (covered.amount * 0.25)))

  yield put(doSell({ rate, amount: covered.amount, profit, coverId }))
  const response = yield race({ success: take(sellSuccess), failure: take(sellFailure) })

  if (response.success) yield put(botMessage(`Продано за ${rate}, покрыто ${covered.rate}, объём ${covered.amount}, прибыль: ${profit}`))
  else if (response.failure) yield put(botMessage(`Продажа не удалась. Ошибка: ${response.failure.payload.error}`))
}
