import { select, put, fork, take, throttle } from 'redux-saga/effects'
import { setCurrency, addStats, addEstimateRatio, setCurrentFinalResult, botMessage } from 'shared/actions'
import { cropNumber } from 'server/utils'
import { FIVE_MINUTES } from 'const'
import { buySaga, sellSaga } from './trade'
import {
  selectSellsLastTime, selectBuysLastTime, selectCurrencyProps,
  selectLastEstimateRatios, selectLastTenStats, selectThreshold
} from './selectors'

const getRate = i => i[1]
const getSumm = (a, b) => cropNumber(a + b)

const calcRelativeDynamic = (prev, curr, index) =>
  index === 1 ?
    [ [ cropNumber(curr / prev) ], curr ] :
    [ [ ...prev[0], cropNumber(curr / prev[1]) ], curr ]

const getRateChange = arr => arr
  .map(getRate)
  .reduce(calcRelativeDynamic)[0]
  // .map(bigToNumber)
  .reduce(getSumm) / arr.length


export function* generateStatsSaga() {
  const { last } = yield select(selectCurrencyProps)
  const buys = yield select(selectBuysLastTime, FIVE_MINUTES)
  const sells = yield select(selectSellsLastTime, FIVE_MINUTES)

  if (buys.length >= 2 && sells.length >= 2) {
    // увеличивается - курс поднимают, чем выше, тем активнее поднимают
    const buyChange = getRateChange(buys)
    // уменьшается - курс активно сваливают, чем ниже, тем сильнее обваливают,
    // поднимается - просто торгуют, курс увеличивается
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

  while (true) {
    yield take(addStats)
    const lastTenStats = yield select(selectLastTenStats)
    const hold = yield select(selectThreshold)

    if (lastTenStats.length >= 10) {
      const calcDynamic = arr => {
        let result = 0
        arr.reduce((prev, curr) => {
          result = prev <= curr ? result + 1 : result - 1
          return curr
        })
        return result
      }

      const buysDyn = calcDynamic(lastTenStats.map(v => v[1]))
      const sellsDyn = calcDynamic(lastTenStats.map(v => v[2]))

      const lowestAsk = lastTenStats[9][3]
      const highestBid = lastTenStats[9][4]

      console.log({ buysDyn, sellsDyn })
      console.log({ lowestAsk, highestBid })

      // buysDyn растёт - lowestAsk уменьшается
      // buysDyn падает - lowestAsk увеличивается
      // buysDyn падает - курс увеличивается
      // sellsDyn растёт - highestBid растёт

      // sellsDyn растёт - цена продажи растёт, ждать пика и продавать
      // buysDyn растёт - цена покупки растёт, ждать пика и продавать

      if (sellsDyn > prevSellsDyn && buysDyn >= prevBuysDyn && sellsDyn >= 0)
        yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), hold)

      if (buysDyn < prevBuysDyn && sellsDyn <= prevSellsDyn && buysDyn <= 0)
        yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)

      // if (sellsDyn > prevSellsDyn && (sellsDyn >= 5 || buysDyn <= -5 || sellsDyn >= buysDyn + 4))
      //   yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), hold)
      //
      // if (buysDyn > prevBuysDyn && (buysDyn >= 5 || sellsDyn <= -5 || buysDyn >= sellsDyn + 4))
      //   yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)

      prevBuysDyn = buysDyn
      prevSellsDyn = sellsDyn

      // if (buysDyn <= 7 && buysDyn <= buysDyn + 2) console.log('отр. покупаем за ', lastTenStats[9][3])

      // TODO считать покупку по падению цены по покупке
      // TODO считать продажу по падению цены по продаже
      // const buyChangeFinal = lastTenStats.map(v => v[1]).reduce((a, b) => a * b)
      // const sellChangeFinal = lastTenStats.map(v => v[2]).reduce((a, b) => a * b)
      // const finalRatio = sellChangeFinal / buyChangeFinal

      // console.log({ buyChangeFinal, sellChangeFinal })

      // yield put(addEstimateRatio(finalRatio))
    }
  }
}

export function* conclusionStatsSaga() {
  let prevResult

  while (true) {
    yield take(addEstimateRatio)
    const { lowestAsk, highestBid } = yield select(selectCurrencyProps)
    const hold = yield select(selectThreshold)
    const estimates = yield select(selectLastEstimateRatios)

    // console.log(estimates)

    if (estimates.length >= 3) {
      // const result = estimates.reduce((prev, curr, index) =>
      //   (prev[0] < curr ? [ curr, prev[1] + 1 ] : [ curr, prev[1] - 1 ]))

      // if (estimates[0] > estimates[1] && estimates[1] > estimates[2])
      //   console.log('курс понижается', lowestAsk)
      //
      // if (estimates[0] < estimates[1] && estimates[1] < estimates[2])
      //   console.log('курс повышается', highestBid)
      //
      // console.log(estimates[2] - estimates[1] - estimates[0])

      //   yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)

      // if ((prevResult >= 10 && result <= 8) || (prevResult <= -8 && result >= -6)) {
      //   yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), hold)
      //   yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)
      // }

      // yield put(setCurrentFinalResult(result))

      // prevResult = result
    }
  }
}

export function* logBotMessages() {
  while (true) {
    const { payload } = yield take(botMessage)
    console.log(payload)
  }
}

export default function* StatsSaga() {
  yield throttle(5000, setCurrency, generateStatsSaga)
  yield [
    fork(estimateStatsSaga),
    fork(conclusionStatsSaga),
    fork(logBotMessages)
  ]
}
