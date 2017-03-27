import { take, select, fork, put, race } from 'redux-saga/effects'
import { addStats, coverBuy, coverSell, doBuy, doSell, botMessage, buySuccess, buyFailure, sellSuccess, sellFailure } from 'actions'
import { selectPrevStat, selectUncoveredSells, selectUncoveredBuys, selectThreshold, selectCurrencyPair, selectLastTenStat } from 'sagas/selectors'

const cropNumber = num => Number(num.toString().slice(0, 10))

export const checkLastDynamicIsDown = stats =>
  stats.slice(0, 10).reverse().reduce((prev, curr) =>
    (curr[4] < prev[0][4] ? [ curr, prev[1] + 1 ] : [ curr, prev[1] ]),
    [ [ 0, 0, 0, 0, 0 ], 0 ])[1] >= 7

export const checkLastDynamicIsUp = stats =>
  stats.slice(0, 10).reverse().reduce((prev, curr) =>
    (curr[3] > prev[0][3] ? [ curr, prev[1] + 1 ] : [ curr, prev[1] ]),
    [ [ 0, 0, 0, 0, 0 ], 0 ])[1] >= 7

export default function* TradeSaga() {
  while (true) {
    const { payload } = yield take(addStats)
    const prevStat = yield select(selectPrevStat)
    const lastFiveStat = yield select(selectLastTenStat)
    if (lastFiveStat.length > 0 && prevStat && payload) {
      yield fork(estimateStatsSaga, lastFiveStat, prevStat, payload)
    }
  }
}

export function* estimateStatsSaga(lastFiveStat, prevStat, stat) {
  const hold = yield select(selectThreshold)

  // TODO: учитывать прогрессию, а не только последнюю статистику
  // определить когда курс постоянно снижается и тормозить покупки
  // на примере последних десяти статистик
  const isUp = prevStat[1] < stat[1] && prevStat[3] < stat[3]
  const isDown = prevStat[2] < stat[2] && prevStat[4] < stat[4]

  // [ Number(last), buyVolume, sellVolume, buyChange, sellChange ]
  // console.log({ isUp }, prevStat[1] < stat[1], prevStat[3] < stat[3], prevStat[3], stat[3])
  // console.log({ isDown }, prevStat[2] < stat[2], prevStat[4] < stat[4], prevStat[4], stat[4])

  const dynamicIsDown = checkLastDynamicIsDown(lastFiveStat)
  const dynamicIsUp = checkLastDynamicIsUp(lastFiveStat)

  // если падение стабильно долгое несколько подряд, то ждать дна и при подъёме продолжать покупать

  if (dynamicIsDown) yield put(botMessage('Резкое падение курса, покупки приостановлены'))
  else if (isDown) yield fork(buySaga, stat[0], hold)

  if (dynamicIsUp) yield put(botMessage('Резкий скачок курса, продажи приостановлены'))
  else if (isUp) yield fork(sellSaga, stat[0], hold)

  // if (!isUp && !isDown) yield put(botMessage('Стагнация, господа.'))
}

export function* buySaga(rate, hold) {
  const searchMinimalSellIndex = (arr, byRate) => {
    const moreThenBuy = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr > byRate + hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...moreThenBuy)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  // цену спроса указать как цену спроса бля
  const { lowestAsk } = yield select(selectCurrencyPair)
  const fullRate = cropNumber(Number(lowestAsk) + 0.00000001)
  const sells = yield select(selectUncoveredSells)
  const [ coverIndex, coverRate, coverValue ] = searchMinimalSellIndex(sells, fullRate)

  if (coverIndex !== -1) {
    const fee = coverValue * 0.25
    const profit = cropNumber((coverRate - fullRate) * (coverValue - fee))

    yield put(coverSell(coverIndex))
    yield put(doBuy([ fullRate, coverValue ]))

    const { success, failure } = yield race({
      success: take(buySuccess),
      failure: take(buyFailure)
    })

    if (success) yield put(botMessage(`Куплено за ${fullRate}, покрыто ${coverRate}, объём ${coverValue}, прибыль ${profit}`))
    else if (failure) yield put(botMessage(`Покупка не удалась. Ошибка: ${failure.payload[2]}`))
  } else {
    yield put(botMessage(`Покупка за ${fullRate} не покрывает ни одной предыдущей продажи`))
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

  const { highestBid } = yield select(selectCurrencyPair)
  const fullRate = cropNumber(Number(highestBid) - 0.00000001)
  const buys = yield select(selectUncoveredBuys)
  const [ coverIndex, coverRate, coverValue ] = searchMinimalBuyIndex(buys, fullRate)

  if (coverIndex !== -1) {
    const fee = coverValue * 0.25
    const profit = cropNumber((fullRate - coverRate) * (coverValue - fee))

    yield put(coverBuy(coverIndex))
    yield put(doSell([ fullRate, coverValue ]))

    const { success, failure } = yield race({
      success: take(sellSuccess),
      failure: take(sellFailure)
    })

    if (success) yield put(botMessage(`Продано за ${fullRate}, покрыто ${coverRate}, объём ${coverValue}, прибыль: ${profit}`))
    else if (failure) yield put(botMessage(`Продажа не удалась. Ошибка: ${failure.payload[2]}`))
  } else {
    yield put(botMessage(`Продажа за ${fullRate} не покрывает ни одной предыдущей покупки`))
  }
}
