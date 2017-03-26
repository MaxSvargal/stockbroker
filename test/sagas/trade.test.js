import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import TradeSaga, { estimateStatsSaga, buySaga, sellSaga } from 'sagas/trade'
import { selectUncoveredSells, selectUncoveredBuys, selectThreshold, selectAmountVolume, selectPrevStat } from 'sagas/selectors'
import { doBuy, doSell, coverBuy, coverSell, botMessage, addStats } from 'actions'

test('TradeSaga shouil work correctly', () =>
  testSaga(TradeSaga)
    .next()
    .take(addStats)
    .next({ payload: [ 0.5, 5, 3, 0.06, 0.08 ] })
    .select(selectPrevStat)
    .next([ 0.4, 5, 4, 0.06, 0.09 ])
    .fork(estimateStatsSaga, [ 0.4, 5, 4, 0.06, 0.09 ], [ 0.5, 5, 3, 0.06, 0.08 ])
    .next()
    .take(addStats))

test('estimateStatsSaga should buy on down', () =>
  // args stats [ prev, current ]
  // [ last, buyVolume, sellVolume, buyChange, sellChange ]
  testSaga(estimateStatsSaga, [ 40.5, 14, 15, 0.3, 0.5 ], [ 40.2, 14, 20, 0.3, 0.6 ])
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .fork(buySaga, 40.2, 0.19)
    .next()
    .isDone())

test('estimateStatsSaga should sell on up', () =>
  // args stats [ prev, current ]
  // [ last, buyVolume, sellVolume, buyChange, sellChange ]
  testSaga(estimateStatsSaga, [ 40.1, 14, 15, 0.3, 0.5 ], [ 40.3, 20, 21, 0.35, 0.51 ])
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .fork(sellSaga, 40.3, 0.19)
    .next()
    .isDone())

test('buySaga should compare bill with uncovered sells and buy one', () =>
  testSaga(buySaga, 40.2, 0.19, 0.1)
    .next()
    .select(selectUncoveredSells)
    // [ time, rate, amount, covered ]
    .next([ [ 1, 40.3, 0.1, 0 ], [ 1, 40.4, 0.15, 0 ], [ 0, 40.5, 0.2, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(coverSell(1))
    .next()
    .put(doBuy([ 40.2, 0.15 ]))
    .next()
    .put(botMessage(`Куплено за ${40.2} объёмом ${0.15}, покрыта ставка продажи ${40.4}, профит: ${0.02437499}`))
    .next()
    .isDone())

test('buySaga should not buy when does not cover a minimal rate of any sell', () =>
  testSaga(buySaga, 40.2, 0.19, 0.1)
    .next()
    .select(selectUncoveredSells)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 39.1, 0.0001, 0 ], [ 1, 38.1, 0.0001, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(botMessage(`Покупка за ${40.2} не покрывает ни одной предыдущей продажи.`))
    .next()
    .isDone())

test('sellSaga should compare bill with uncovered buys and sell one', () =>
  testSaga(sellSaga, 40.3, 0.19, 0.1)
    .next()
    .select(selectUncoveredBuys)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 39.8, 0.1, 0 ], [ 1, 39.6, 0.2, 0 ], [ 1, 39.7, 0.1, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(coverBuy(1))
    .next()
    .put(doSell([ 40.3, 0.2 ]))
    .next()
    .put(botMessage(`Продано за ${40.3} объёмом ${0.2}, покрыта ставка покупки ${39.6}, профит: ${0.12999999}`))
    .next()
    .isDone())

test('sellSaga should not sell when does not cover a minimal rate of any buy', () =>
  testSaga(sellSaga, 40.5, 0.19, 0.1)
    .next()
    .select(selectUncoveredBuys)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 41, 0.1, 0 ], [ 1, 40.7, 0.1, 0 ] ])
    // update [ 0, 41.2, 0.1, 0 ] to [ 0, 41.2, 0.1, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(botMessage(`Продажа за ${40.5} не покрывает ни одной предыдущей покупки.`))
    .next()
    .isDone())
