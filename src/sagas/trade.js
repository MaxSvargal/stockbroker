import { take, select, fork, put } from 'redux-saga/effects'
import { addStats, coverBuy, coverSell, doBuy, doSell, botMessage } from 'actions'
import { selectPrevStat, selectUncoveredSells, selectUncoveredBuys, selectThreshold } from 'sagas/selectors'

const cropNumber = num => Number(num.toString().slice(0, 10))

export default function* TradeSaga() {
  // initial
  // yield fork(buySaga, stat[0], hold, amountVolume)

  while (true) {
    const { payload } = yield take(addStats)
    const prevStat = yield select(selectPrevStat)
    if (prevStat && payload) yield fork(estimateStatsSaga, prevStat, payload)
  }
}

export function* estimateStatsSaga(prevStat, stat) {
  const hold = yield select(selectThreshold)

  const isUp = prevStat[0] < stat[0] && prevStat[1] < stat[1] && prevStat[3] < stat[3]
  const isDown = prevStat[0] > stat[0] && prevStat[2] < stat[2] && prevStat[4] < stat[4]

  // если падение стабильно долгое несколько подряд, то ждать дна и при подъёме продолжать покупать
  if (isDown) yield fork(buySaga, stat[0], hold)
  if (isUp) yield fork(sellSaga, stat[0], hold)

  // if (!isUp && !isDown) yield put(botMessage('Стагнация, господа.'))
}

export function* buySaga(rate, hold) {
  const searchMinimalSellIndex = arr => {
    const moreThenBuy = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr > rate + hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...moreThenBuy)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  // цену спроса указать как цену спроса бля

  const sells = yield select(selectUncoveredSells)
  const [ coverIndex, coverRate, coverValue ] = searchMinimalSellIndex(sells)

  if (coverIndex !== -1) {
    // const fee = coverValue * 0.25
    const profit = cropNumber((coverRate - rate) * coverValue)

    yield put(coverSell(coverIndex))
    yield put(doBuy([ rate, coverValue ]))
    yield put(botMessage(`Куплено за ${rate} объёмом ${coverValue}, покрыта ставка продажи ${coverRate}, профит: ${profit}`))
  } else {
    yield put(botMessage(`Покупка за ${rate} не покрывает ни одной предыдущей продажи.`))
  }
}

export function* sellSaga(rate, hold) {
  const searchMinimalBuyIndex = arr => {
    const moreThenSell = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr < rate - hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...moreThenSell)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  // цену продажи указать по цене предложения, а не курса и чуть менее (на копейку)

  const buys = yield select(selectUncoveredBuys)
  const [ coverIndex, coverRate, coverValue ] = searchMinimalBuyIndex(buys)

  if (coverIndex !== -1) {
    // const fee = coverValue * 0.25
    const profit = cropNumber((rate - coverRate) * coverValue)

    yield put(coverBuy(coverIndex))
    yield put(doSell([ rate, coverValue ]))
    yield put(botMessage(`Продано за ${rate} объёмом ${coverValue}, покрыта ставка покупки ${coverRate}, профит: ${profit}`))
  } else {
    yield put(botMessage(`Продажа за ${rate} не покрывает ни одной предыдущей покупки.`))
  }
}
