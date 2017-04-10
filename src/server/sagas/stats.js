import { select, put, fork, take, throttle } from 'redux-saga/effects'
import { setCurrency, addStats, addEstimateRatio, setCurrentFinalResult, botMessage } from 'shared/actions'
import { cropNumber } from 'server/utils'
import { FIVE_MINUTES } from 'const'
import { buySaga, sellSaga } from './trade'
import {
  selectSellsLastTime, selectBuysLastTime, selectCurrencyProps,
  selectEstimateRatios, selectLastTenStats, selectThreshold
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

    yield put(addStats([ currentRate, buyChange, sellChange ]))
  }
}

export function* estimateStatsSaga() {
  while (true) {
    yield take(addStats)
    const lastTenStats = yield select(selectLastTenStats)

    if (lastTenStats.length >= 10) {
      const buyChangeFinal = lastTenStats.map(v => v[1]).reduce((a, b) => a * b)
      const sellChangeFinal = lastTenStats.map(v => v[2]).reduce((a, b) => a * b)
      const finalRatio = sellChangeFinal / buyChangeFinal
      yield put(addEstimateRatio(finalRatio))
    }
  }
}

export function* conclusionStatsSaga() {
  let prevResult

  while (true) {
    yield take(addEstimateRatio)
    const { lowestAsk, highestBid } = yield select(selectCurrencyProps)
    const hold = yield select(selectThreshold)
    const estimates = yield select(selectEstimateRatios)
    if (estimates.length >= 2) {
      const result = estimates.reduce((prev, curr) =>
        (prev[0] < curr ? [ curr, prev[1] + 1 ] : [ curr, prev[1] - 1 ]),
        [ 0, 0 ]
      )[1]

      if ((prevResult >= 10 && result <= 8) && (prevResult <= -8 && result >= -6)) {
        yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), hold)
        yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)
      }

      yield put(setCurrentFinalResult(result))

      prevResult = result
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
