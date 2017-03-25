import { take, select, fork, put } from 'redux-saga/effects'
import { addStats, coverBuy, coverSell, doBuy, doSell, botMessage } from 'actions'
import { selectPrevStat, selectUncoveredSells, selectUncoveredBuys, selectThreshold, selectAmountVolume } from 'sagas/selectors'

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
  const amountVolume = yield select(selectAmountVolume)

  const isUp = prevStat[0] < stat[0] && prevStat[1] < stat[1] && prevStat[3] < stat[3]
  const isDown = prevStat[0] > stat[0] && prevStat[2] < stat[2] && prevStat[4] < stat[4]

  if (isDown) yield fork(buySaga, stat[0], hold, cropNumber(amountVolume + 0.00000001))
  if (isUp) yield fork(sellSaga, stat[0], hold, cropNumber(amountVolume - 0.00000001))

  // if (!isUp && !isDown) yield put(botMessage('Стагнация, господа.'))
}

export function* buySaga(rate, hold, amountVolume) {
  const searchUncoveredSellsIndex = arr =>
    arr.reverse().reduce((prev, curr, index) =>
      (curr[1] + hold >= rate ? index : prev), -1)

  const sells = yield select(selectUncoveredSells)
  const uncoveredIndex = searchUncoveredSellsIndex(sells)

  if (uncoveredIndex !== -1) {
    const fee = amountVolume * 0.15
    const profit = cropNumber((sells[uncoveredIndex][1] - rate - fee) * amountVolume)

    yield put(coverSell(uncoveredIndex))
    yield put(doBuy([ rate, amountVolume ]))
    yield put(botMessage(`Куплено за ${rate} объёмом ${amountVolume}, покрыта ставка по ${sells[uncoveredIndex][1]}, профит: ${profit}`))
  } else {
    yield put(botMessage(`Покупка за ${rate} не покрывает ни одной предыдущей продажи.`))
  }
}

export function* sellSaga(rate, hold, amountVolume) {
  // Проверить наоборот что бы покрываемая ставка была больше покупки
  const searchUncoveredBuysIndex = arr =>
    arr.reverse().reduce((prev, curr, index) =>
      (curr[1] + hold <= rate ? index : prev), -1)

  const buys = yield select(selectUncoveredBuys)
  const uncoveredIndex = searchUncoveredBuysIndex(buys)

  if (uncoveredIndex !== -1) {
    const fee = amountVolume * 0.15
    const profit = cropNumber((rate - buys[uncoveredIndex][1] - fee) * amountVolume)

    yield put(coverBuy(uncoveredIndex))
    yield put(doSell([ rate, amountVolume, profit ]))
    yield put(botMessage(`Продано за ${rate} объёмом ${amountVolume}, покрыта ставка по ${buys[uncoveredIndex][1]}, профит: ${profit}`))
  } else {
    yield put(botMessage(`Продажа за ${rate} не покрывает ни одной предыдущей покупки.`))
  }
}
