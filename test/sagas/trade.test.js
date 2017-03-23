import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import TradeSaga, { estimateStatsSaga } from 'sagas/trade'
import { selectUncoveredSells, selectUncoveredBuys, selectThreshold, selectAmountVolume, selectPrevStat } from 'sagas/selectors'
import { doBuy, doSell, coverBuy, coverSell, botMessage, addStats } from 'actions'

test('estimateStatsSaga should buy on down', () =>
  // args stats [ prev, current ]
  // [ last, buyVolume, sellVolume, buyChange, sellChange ]
  testSaga(estimateStatsSaga, [ 40.5, 14, 15, 0.3, 0.5 ], [ 40.2, 14, 20, 0.3, 0.6 ])
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .select(selectAmountVolume)
    .next(0.0002)
    .select(selectUncoveredSells)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 40.4, 0.0001, 0 ], [ 1, 40.1, 0.0001, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(coverSell(1))
    .next()
    .put(doBuy([ 40.2, 0.0002 ])))

test('estimateStatsSaga should not buy when does not cover the minimal amount on any sell', () =>
  // args stats [ prev, current ]
  // [ last, buyVolume, sellVolume, buyChange, sellChange ]
  testSaga(estimateStatsSaga, [ 40.5, 14, 15, 0.3, 0.5 ], [ 40.2, 14, 20, 0.3, 0.6 ])
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .select(selectAmountVolume)
    .next(0.0002)
    .select(selectUncoveredSells)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 39.1, 0.0001, 0 ], [ 1, 38.1, 0.0001, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(botMessage('Покупка за 40.2 не покрывает суммы ни одной предыдущей продажи.')))


test('estimateStatsSaga should sell on up', () =>
  // args stats [ prev, current ]
  // [ last, buyVolume, sellVolume, buyChange, sellChange ]
  testSaga(estimateStatsSaga, [ 40.1, 14, 15, 0.3, 0.5 ], [ 40.3, 20, 21, 0.35, 0.51 ])
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .select(selectAmountVolume)
    .next(0.0002)
    .select(selectUncoveredBuys)
    // [ time, rate, amount, covered ]
    .next([ [ 1, 40.6, 0.0001, 0 ], [ 0, 39.8, 0.0001, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(coverBuy(0))
    .next()
    .put(doSell([ 40.3, 0.0002 ])))

test('estimateStatsSaga should not sell when does not cover the minimal amount of any buy', () =>
  // args stats [ prev, current ]
  // [ last, buyVolume, sellVolume, buyChange, sellChange ]
  testSaga(estimateStatsSaga, [ 40.2, 1, 0, 0.3, 0.5 ], [ 40.5, 2, 1, 0.35, 0.55 ])
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .select(selectAmountVolume)
    .next(0.0002)
    .select(selectUncoveredBuys)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 41, 0.0001, 0 ], [ 1, 40.7, 0.0001, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(botMessage('Продажа за 40.5 не покрывает суммы ни одной предыдущей покупки.')))

test('TradeSaga', () =>
  testSaga(TradeSaga)
    .next()
    .take(addStats)
    .next([ 0.5, 5, 3, 0.06, 0.08 ])
    .select(selectPrevStat)
    .next([ 0.4, 5, 4, 0.06, 0.09 ])
    .fork(estimateStatsSaga, [ 0.4, 5, 4, 0.06, 0.09 ], [ 0.5, 5, 3, 0.06, 0.08 ])
    .next()
    .take(addStats))
