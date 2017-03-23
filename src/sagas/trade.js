import { take, select, fork, put } from 'redux-saga/effects'
import { addStats, coverBuy, coverSell, doBuy, doSell, botMessage } from 'actions'
import { selectPrevStat, selectUncoveredSells, selectUncoveredBuys, selectThreshold, selectAmountVolume } from 'sagas/selectors'

export default function* TradeSaga() {
  while (true) {
    const { payload } = yield take(addStats)
    const prevStat = yield select(selectPrevStat)
    if (prevStat && payload) yield fork(estimateStatsSaga, prevStat, payload)
  }
}

export function* estimateStatsSaga(prevStat, stat) {
  const hold = yield select(selectThreshold)
  const amountVolume = yield select(selectAmountVolume)

  const searchUncoveredBuysIndex = arr =>
    arr.reverse().reduce((prev, curr, index) =>
      (curr[1] + hold >= stat[0] ? index : prev), -1)

  const searchUncoveredSellsIndex = arr =>
    arr.reverse().reduce((prev, curr, index) =>
      (curr[1] + hold <= stat[0] ? index : prev), -1)

  if (prevStat[0] > stat[0] &&
      prevStat[1] >= stat[1] &&
      prevStat[2] - stat[2] <= 5 &&
      prevStat[3] >= stat[3] &&
      prevStat[4] < stat[4]) {
    const buys = yield select(selectUncoveredSells)
    const uncoveredIndex = searchUncoveredBuysIndex(buys)

    if (uncoveredIndex !== -1 || buys.length === 0) {
      const buy = [ stat[0], amountVolume ]

      yield put(coverSell(uncoveredIndex))
      yield put(doBuy(buy))
      yield put(botMessage(`Куплено за ${stat[0]} объёмом ${amountVolume}`))
    } else {
      yield put(botMessage(`Покупка за ${stat[0]} не покрывает суммы ни одной предыдущей продажи.`))
    }
  } else {
    const sells = yield select(selectUncoveredBuys)
    const uncoveredIndex = searchUncoveredSellsIndex(sells)

    if (uncoveredIndex !== -1 || sells.length === 0) {
      const sell = [ stat[0], amountVolume ]

      yield put(coverBuy(uncoveredIndex))
      yield put(doSell(sell))
      yield put(botMessage(`Продано за ${stat[0]} объёмом ${amountVolume}`))
    } else {
      yield put(botMessage(`Продажа за ${stat[0]} не покрывает суммы ни одной предыдущей покупки.`))
    }
  }
}
