import { select, put, fork, take, throttle } from 'redux-saga/effects'
import { setCurrency, addStats, addEstimateRatio, setCurrentFinalResult } from 'shared/actions'
import BigNumber from 'bignumber.js'
import { cropNumber } from 'server/utils'
import { TEN_MINUTES } from 'const'
import { selectSellsLastTime, selectBuysLastTime, selectCurrencyPair, selectEstimateRatios, selectLastTenStats, selectThreshold } from './selectors'
import { buySaga, sellSaga } from './trade'

const getRate = i => i[1]
const getSumm = (a, b) => a + b
const bigToNumber = bn => bn.toNumber()
const calcRelativeDynamic = (prev, curr, index) =>
  index === 1 ?
    [ [ new BigNumber(curr).div(prev) ], curr ] :
    [ [ ...prev[0], new BigNumber(curr).div(prev[1]) ], curr ]

const getRateChange = arr => arr
  .map(getRate)
  .reduce(calcRelativeDynamic)[0]
  .map(bigToNumber)
  .reduce(getSumm) / arr.length


export function* generateStatsSaga() {
  const { last } = yield select(selectCurrencyPair)
  const buys = yield select(selectBuysLastTime, TEN_MINUTES)
  const sells = yield select(selectSellsLastTime, TEN_MINUTES)

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
  let lastResult

  while (true) {
    yield take(addEstimateRatio)
    const { lowestAsk, highestBid } = yield select(selectCurrencyPair)
    const hold = yield select(selectThreshold)
    const estimates = yield select(selectEstimateRatios)
    const result = estimates.reduce((prev, curr) =>
      (prev[0] <= curr ? [ curr, prev[1] + 1 ] : [ curr, prev[1] - 1 ]),
      [ 0, 0 ]
    )[1]

    if ((lastResult >= 9 && result <= 9) || (lastResult >= 2 && result <= 1)) {
      yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), hold)
    }

    if ((lastResult <= -9 && result <= -8) || (lastResult <= -2 && result >= 0)) {
      yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), hold)
    }

    yield put(setCurrentFinalResult(result))

    if (lastResult >= 9 && result <= 9) console.log('Идём на спад, продаём', highestBid)
    if (lastResult >= 2 && result <= 1) console.log('Скоро упадём, продаём?', highestBid)

    if (lastResult <= -9 && result <= -8) console.log('Идём вверх, покупаем', lowestAsk)
    if (lastResult <= -2 && result >= 0) console.log('Скоро поднимемся, можно купить', lowestAsk)

    lastResult = result
  }
}

export default function* StatsSaga() {
  yield throttle(5000, setCurrency, generateStatsSaga)
  yield fork(estimateStatsSaga)
  yield fork(conclusionStatsSaga)
}
