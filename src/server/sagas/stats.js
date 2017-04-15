import { delay } from 'redux-saga'
import { select, put, fork, take, throttle } from 'redux-saga/effects'
import { setCurrency, addStats, botMessage } from 'shared/actions'
import { cropNumber } from 'server/utils'
import { FIVE_MINUTES } from 'const'
import { buySaga, sellSaga } from './trade'
import {
  selectSellsLastTime, selectBuysLastTime, selectLastTenStats, selectProfitThreshold, selectTransactions,
  selectCurrencyProps
} from './selectors'

const calcRelativeDynamic = (prev, curr, index) =>
  index === 1 ?
    [ [ cropNumber(curr / prev) ], curr ] :
    [ [ ...prev[0], cropNumber(curr / prev[1]) ], curr ]

const getRateChange = arr => arr
  .map(i => i[1])
  .reduce(calcRelativeDynamic)[0]
  .reduce((a, b) => cropNumber(a + b)) / arr.length


export function* generateStatsSaga() {
  const buys = yield select(selectBuysLastTime, FIVE_MINUTES)
  const sells = yield select(selectSellsLastTime, FIVE_MINUTES)

  if (buys.length >= 4 && sells.length >= 4) {
    const { last } = yield select(selectCurrencyProps)
    const buyChange = getRateChange(buys)
    const sellChange = getRateChange(sells)

    const currentRate = Number(last)
    const lowestAsk = Number(buys[buys.length - 1][1])
    const highestBid = Number(sells[sells.length - 1][1])

    yield put(addStats([ currentRate, buyChange, sellChange, lowestAsk, highestBid ]))
  }
}

export function* estimateStatsSaga() {
  let prevBuysDyn
  let prevSellsDyn
  const calcDynamic = arr => {
    let result = 0
    arr.reduce((prev, curr) =>
      (result = prev <= curr ? result + 1 : result - 1) || curr)
    return result
  }

  while (true) {
    yield take(addStats)
    const lastTenStats = yield select(selectLastTenStats)
    const hold = yield select(selectProfitThreshold)

    if (lastTenStats.length >= 10) {
      const buysDyn = calcDynamic(lastTenStats.map(v => v[1]))
      const sellsDyn = calcDynamic(lastTenStats.map(v => v[2]))
      const lowestAsk = lastTenStats[9][3]
      const highestBid = lastTenStats[9][4]

      if (sellsDyn > prevSellsDyn)
        yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), hold)

      if (buysDyn < prevBuysDyn)
        yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)

      prevBuysDyn = buysDyn
      prevSellsDyn = sellsDyn
    }
  }
}

export function* logBotMessages() {
  while (true) {
    const { payload } = yield take(botMessage)
    console.log(payload)
  }
}

export function* getDayProfitFalue() {
  while (true) {
    yield delay(10000)
    const trans = yield select(selectTransactions)
    console.log(Object.keys(trans).length)
  }
}

export default function* StatsSaga() {
  yield throttle(5000, setCurrency, generateStatsSaga)
  yield [
    fork(estimateStatsSaga),
    fork(logBotMessages)
    // fork(getDayProfitFalue)
  ]
}
