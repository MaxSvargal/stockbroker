import debug from 'debug'
import { delay } from 'redux-saga'
import { select, fork, take, put } from 'redux-saga/effects'
import { addStats, addChunks, cleanChunksType, stopTransactionsType } from '../../shared/actions'
import { cropNumber, now } from '../../shared/utils'
import { buySaga, sellSaga } from './trade'
import {
  selectAvaliablePurposeBalance,
  selectAvaliableSourceCurrency,
  selectBuyProfitThreshold,
  selectChunkAmount,
  selectLastStat,
  selectSellProfitThreshold,
  selectStatsDuringTime,
  selectStopTransactionState
} from './selectors'

const TWENTY_MINUTES = 1000 * 60 * 20

export function* estimateGlobalStatsSaga() {
  let prevGlobalBuyDyn
  let prevGlobalSellDyn
  let maximumDynamic

  const getSumm = (arr, key) => arr.length <= 0 ? 0 :
    arr.map(v => v[key]).reduce((a, b) => a + b) / arr.length

  while (true) {
    yield take(addStats)
    yield delay(50)
    const globalStatsWithCurr = yield select(selectStatsDuringTime, now() - TWENTY_MINUTES)
    const globalStats = globalStatsWithCurr.slice(0, globalStatsWithCurr.length - 1)

    if (globalStats.length >= 2) {
      const globalBuyDyn = cropNumber(getSumm(globalStats, 'buyChange'))
      const globalSellDyn = cropNumber(getSumm(globalStats, 'sellChange'))

      if (globalBuyDyn < prevGlobalBuyDyn && globalSellDyn < prevGlobalSellDyn) {
        if (maximumDynamic < (globalBuyDyn + globalSellDyn) / 2)
          yield fork(boostSells)
        else
          yield fork(stopBuys)
        // if ((prevGlobalBuyDyn > 0 || prevGlobalSellDyn > 0) && (globalBuyDyn < 0 || globalSellDyn < 0))
        //   yield fork(boostSells)
        // else
        //   yield fork(stopBuys)
      }

      if (globalBuyDyn > prevGlobalBuyDyn && globalSellDyn > prevGlobalSellDyn) {
        maximumDynamic = (globalBuyDyn + globalSellDyn) / 2
        if ((prevGlobalBuyDyn < 0 || prevGlobalSellDyn < 0) && (globalBuyDyn > 0 || globalSellDyn > 0))
          yield fork(boostBuys)
        else
          yield fork(stopSells)
      }

      debug('worker')('==============')
      debug('worker')('buy dyn change %d', globalBuyDyn, prevGlobalBuyDyn, globalBuyDyn / prevGlobalBuyDyn)
      debug('worker')('buy sell change %d', globalSellDyn, prevGlobalSellDyn, globalSellDyn / prevGlobalSellDyn)

      prevGlobalBuyDyn = globalBuyDyn
      prevGlobalSellDyn = globalSellDyn
    }
  }
}

export function* estimateLocalStatsSaga() {
  let prevStat
  let lastBuyRate
  let lastSellRate

  while (true) {
    const { payload: stat } = yield take(addStats)
    const { buyChange, sellChange, lowestAsk, highestBid } = stat
    debug('trade')({ buyChange, sellChange })

    if (prevStat) {
      const isBuysStop = yield select(selectStopTransactionState, 'buy')
      const isSellsStop = yield select(selectStopTransactionState, 'sell')

      if (!isBuysStop && buyChange / prevStat.buyChange < 1 && lastBuyRate !== lowestAsk) {
        yield fork(triggerBuy)
        lastBuyRate = lowestAsk
      }

      if (!isSellsStop && sellChange / prevStat.sellChange > 1 && lastSellRate !== highestBid) {
        yield fork(triggerSell)
        lastSellRate = highestBid
      }
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

export function* boostBuys() {
  debug('trade')('Динамика была ниже нуля, но начала подниматься. Активно закупаемся!')
  const availableSourceCurrency = yield select(selectAvaliableSourceCurrency)
  const chunkAmount = yield select(selectChunkAmount)
  const { highestBid } = yield select(selectLastStat)
  yield put(addChunks({
    type: 'sell',
    creationMethod: 'hollow',
    num: Math.floor((availableSourceCurrency * 0.25) / chunkAmount),
    rate: highestBid * 1.05,
    amount: chunkAmount
  }))
  yield put(stopTransactionsType('buy', false))
}

export function* boostSells() {
  // бред блять. Динамика падает ниже нуля только на дне, а на пике она максимальна
  // сохранять максимальную динамику и если она начала падать, то продавать к хуям всё что накопилось
  debug('trade')('Динамика упала ниже нуля. Будет падение. Распродажа!')
  const availablePurposeBalance = yield select(selectAvaliablePurposeBalance)
  const chunkAmount = yield select(selectChunkAmount)
  const { lowestAsk } = yield select(selectLastStat)
  yield put(addChunks({
    type: 'buy',
    creationMethod: 'hollow',
    num: Math.floor((availablePurposeBalance * 0.25) / chunkAmount),
    rate: lowestAsk * 0.95,
    amount: chunkAmount
  }))
  yield put(stopTransactionsType('sell', false))
}

export function* stopBuys() {
  debug('trade')('Динамика падает. Останавливаем покупки.')
  // yield put(cleanChunksType('buy'))
  yield put(stopTransactionsType('buy', true))
  yield put(stopTransactionsType('sell', false))
}

export function* stopSells() {
  // TODO clean chunks when rate is out
  debug('trade')('Динамика растёт. Останавливаем продажи.')
  // yield put(cleanChunksType('sell'))
  yield put(stopTransactionsType('sell', true))
  yield put(stopTransactionsType('buy', false))
}

export default function* decisionSaga() {
  // yield fork(estimateGlobalStatsSaga)
  yield fork(estimateLocalStatsSaga)
}
