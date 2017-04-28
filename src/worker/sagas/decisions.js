import debug from 'debug'
import { select, fork, take } from 'redux-saga/effects'
import { addStats } from '../../shared/actions'
import { cropNumber, now } from '../../shared/utils'
import { buySaga, sellSaga } from './trade'
import { selectLastStat, selectStatsDuringTime, selectSellProfitThreshold, selectBuyProfitThreshold } from './selectors'

const THIRTY_MINUTES = 1000 * 60 * 30

export function* estimateStatsSaga() {
  let prevStat
  let lastBuyRate
  let lastSellRate
  let prevGlobalBuyDyn
  let prevGlobalSellDyn

  const getSumm = (arr, key) => arr.length <= 0 ? 0 :
    arr.map(v => v[key]).reduce((a, b) => a + b) / arr.length

  while (true) {
    const { payload: stat } = yield take(addStats)
    const globalStatsWithCurr = yield select(selectStatsDuringTime, now() - THIRTY_MINUTES - 1000)
    const globalStats = globalStatsWithCurr.slice(0, globalStatsWithCurr.length - 1)

    if (prevStat && globalStats.length > 2) {
      const globalBuyDyn = cropNumber(getSumm(globalStats, 'buyChange'))
      const globalSellDyn = cropNumber(getSumm(globalStats, 'sellChange'))

      debug('worker')('==============')
      debug('worker')('buy dyn change %d', globalBuyDyn, prevGlobalBuyDyn)
      debug('worker')('buy sell change %d', globalSellDyn, prevGlobalSellDyn)
      debug('worker')('buy change %d', stat.buyChange / prevStat.buyChange)
      debug('worker')('sell change %d', stat.sellChange / prevStat.sellChange)

      // создать пять чанок продажи в 2 раза больше авточанки или 0.01 и стоимостью как курс минус три значения порога

      if (globalBuyDyn < prevGlobalBuyDyn && globalSellDyn < prevGlobalSellDyn) {
        if ((prevGlobalBuyDyn > 0 || prevGlobalSellDyn > 0) && (globalBuyDyn < 0 || globalSellDyn < 0))
          debug('trade')('Динамика упала ниже нуля. Будет падение. Распродажа!')
        else
          debug('trade')('Динамика падает, продаём, покупаем меньше.')
      }

      if (globalBuyDyn > prevGlobalBuyDyn && globalSellDyn > prevGlobalSellDyn) {
        if ((prevGlobalBuyDyn < 0 || prevGlobalSellDyn < 0) && (globalBuyDyn > 0 || globalSellDyn > 0))
          debug('trade')('Динамика была ниже нуля, но начала подниматься. Активно закупаемся!')
        else
          debug('trade')('Динамика растёт, покупаем активнее, притормаживаем продажи.')
      }

      if (
        stat.buyChange / prevStat.buyChange < 1 &&
        // stat.lowestAsk === stat.last &&
        lastBuyRate !== stat.lowestAsk
      ) {
        yield fork(triggerBuy)
        lastBuyRate = stat.lowestAsk
      }

      if (
        stat.sellChange / prevStat.sellChange > 1 &&
        // stat.highestBid === stat.last &&
        lastSellRate !== stat.highestBid
      ) {
        yield fork(triggerSell)
        lastSellRate = stat.highestBid
      }

      prevGlobalBuyDyn = globalBuyDyn
      prevGlobalSellDyn = globalSellDyn
    }

    prevStat = stat
  }
}

export function* triggerBuy() {
  const buyHold = yield select(selectBuyProfitThreshold)
  const { lowestAsk } = yield select(selectLastStat)
  yield fork(buySaga, cropNumber(Number(lowestAsk) + 0.00000001), buyHold)
  debug('trade')('покупаем за', lowestAsk)
}

export function* triggerSell() {
  const sellHold = yield select(selectSellProfitThreshold)
  const { highestBid } = yield select(selectLastStat)
  yield fork(sellSaga, cropNumber(Number(highestBid) - 0.00000001), sellHold)
  debug('trade')('продаём за', highestBid)
}

export default function* decisionSaga() {
  yield fork(estimateStatsSaga)
}
