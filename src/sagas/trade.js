import { take, select, put, race } from 'redux-saga/effects'
import { cropNumber } from 'utils'
import { doBuy, doSell, botMessage, buySuccess, buyFailure, sellSuccess, sellFailure } from 'actions'
import { selectUncoveredSells, selectUncoveredBuys } from 'sagas/selectors'

/* eslint require-yield: 0 */
export default function* TradeSaga() {
  false
}

export function* buySaga(rate, hold) {
  // брать самый объёмный чанк
  const searchMinimalSellIndex = (arr, byRate) => {
    const lessThenBuy = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr > byRate + hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...lessThenBuy)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  const sells = yield select(selectUncoveredSells)
  const [ coverIndex, coverRate, coverValue ] = searchMinimalSellIndex(sells, rate)

  if (coverIndex !== -1) {
    const fee = coverValue * 0.25
    const profit = cropNumber((coverRate - rate) * (coverValue - fee))

    yield put(doBuy([ rate, coverValue, coverIndex ]))

    const { success, failure } = yield race({
      success: take(buySuccess),
      failure: take(buyFailure)
    })

    if (success) yield put(botMessage(`Куплено за ${rate}, покрыто ${coverRate}, объём ${coverValue}, прибыль ${profit}`))
    else if (failure) yield put(botMessage(`Покупка не удалась. Ошибка: ${failure.payload[2]}`))
  } else {
    yield put(botMessage(`Покупка за ${rate} не покрывает ни одной предыдущей продажи`))
  }
}

export function* sellSaga(rate, hold) {
  const searchMinimalBuyIndex = (arr, byRate) => {
    const moreThenSell = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr < byRate - hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...moreThenSell)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  const buys = yield select(selectUncoveredBuys)
  const [ coverIndex, coverRate, coverValue ] = searchMinimalBuyIndex(buys, rate)

  if (coverIndex !== -1) {
    const fee = coverValue * 0.25
    const profit = cropNumber((rate - coverRate) * (coverValue - fee))

    yield put(doSell([ rate, coverValue, coverIndex ]))

    const { success, failure } = yield race({
      success: take(sellSuccess),
      failure: take(sellFailure)
    })

    if (success) yield put(botMessage(`Продано за ${rate}, покрыто ${coverRate}, объём ${coverValue}, прибыль: ${profit}`))
    else if (failure) yield put(botMessage(`Продажа не удалась. Ошибка: ${failure.payload[2]}`))
  } else {
    yield put(botMessage(`Продажа за ${rate} не покрывает ни одной предыдущей покупки`))
  }
}
