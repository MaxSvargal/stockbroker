import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import TradeSaga, { estimateStatsSaga, buySaga, sellSaga, checkLastDynamicIsDown } from 'sagas/trade'
import { selectLastTenStats, selectUncoveredSells, selectUncoveredBuys, selectThreshold, selectCurrencyPair } from 'sagas/selectors'
import { doBuy, doSell, coverBuy, coverSell, botMessage, addStats } from 'actions'

test('buySaga should work correctly', () =>
  testSaga(buySaga, 0.05, 0.01)
    .next()
    .select(selectUncoveredSells)
    .next([ [ 0, 0.045, 2, -1, 0 ], [ 0, 0.062, 3, -1, 0 ] ])
    .put(doBuy([ 0.05, 3, 1 ])))

test('sellSaga should work correctly', () =>
  testSaga(sellSaga, 0.05, 0.01)
    .next()
    .select(selectUncoveredBuys)
    .next([ [ 0, 0.045, 2, -1, 0 ], [ 0, 0.035, 3, -1, 0 ] ])
    .put(doSell([ 0.05, 3, 1 ])))

test('sellSaga should work on real data correctly', () =>
  testSaga(sellSaga, 0.04993999, 0.0001)
    .next()
    .select(selectUncoveredBuys)
    .next([ [ 0, 0.0498, 0.2, -1, 0 ] ])
    .put(doSell([ 0.04993999, 0.2, 0 ])))


test.skip('TradeSaga should work correctly', () =>
  testSaga(TradeSaga)
    .next()
    .take(addStats)
    .next()
    .select(selectLastTenStats)
    .next([ [], [], [], [], [], [], [], [], [], [] ])
    .fork(estimateStatsSaga, [ [], [], [], [], [], [], [], [], [], [] ])
    .next()
    .take(addStats))

test.skip('estimateStatsSaga should buy on down', () => {
  const stats = [
    [ 0.56, 6, 3, 0.9875, 0.8612 ],
    [ 0.55, 7, 4, 0.9885, 0.8611 ],
    [ 0.54, 7, 6, 0.9885, 0.8609 ],
    [ 0.55, 8, 6, 0.9891, 0.8607 ],
    [ 0.56, 9, 6, 0.9895, 0.8611 ],
    [ 0.54, 9, 7, 0.9895, 0.8612 ],
    [ 0.53, 9, 8, 0.9896, 0.8613 ],
    [ 0.52, 9, 9, 0.9897, 0.8611 ],
    [ 0.51, 9, 10, 0.9898, 0.8610 ],
    [ 0.52, 10, 11, 0.9899, 0.8609 ]
  ]

  testSaga(estimateStatsSaga, stats)
    .next()
    // value of minimum profit is 0.19 coins
    .select(selectThreshold)
    .next(0.19)
    .fork(buySaga, 40.2, 0.19)
    .next()
    .isDone()
})

test.skip('estimateStatsSaga should sell on up', () =>
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

test.skip('buySaga should compare bill with uncovered sells and buy one', () =>
  testSaga(buySaga, 40.2, 0.19, 0.1)
    .next()
    .select(selectCurrencyPair)
    .next({ lowestAsk: 40.25 })
    .select(selectUncoveredSells)
    // [ time, rate, amount, covered ]
    .next([ [ 1, 40.3, 0.1, 0 ], [ 1, 40.4, 0.15, 0 ], [ 0, 40.5, 0.2, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(coverSell(2))
    .next()
    .put(doBuy([ 40.25, 0.2 ]))
    .next()
    .put(botMessage(`Куплено за ${40.25} объёмом ${0.2}, покрыта ставка продажи ${40.5}, профит: ${0.05}`))
    .next()
    .isDone())

test.skip('buySaga should not buy when does not cover a minimal rate of any sell', () =>
  testSaga(buySaga, 40.2, 0.19, 0.1)
    .next()
    .select(selectCurrencyPair)
    .next({ lowestAsk: 40.35 })
    .select(selectUncoveredSells)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 39.1, 0.0001, 0 ], [ 1, 38.1, 0.0001, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(botMessage(`Покупка за ${40.35} не покрывает ни одной предыдущей продажи.`))
    .next()
    .isDone())

test.skip('sellSaga should compare bill with uncovered buys and sell one', () =>
  testSaga(sellSaga, 40.3, 0.19, 0.1)
    .next()
    .select(selectCurrencyPair)
    .next({ highestBid: 40.25 })
    .select(selectUncoveredBuys)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 39.8, 0.1, 0 ], [ 1, 39.6, 0.2, 0 ], [ 1, 39.7, 0.1, 0 ] ])
    // update [ 0, 41.2, 0.0001, 0 ] to [ 0, 41.2, 0.0001, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(coverBuy(1))
    .next()
    .put(doSell([ 40.2499999, 0.2 ]))
    .next()
    .put(botMessage(`Продано за ${40.2499999} объёмом ${0.2}, покрыта ставка покупки ${39.6}, профит: ${0.12999997}`))
    .next()
    .isDone())

test.skip('sellSaga should not sell when does not cover a minimal rate of any buy', () =>
  testSaga(sellSaga, 40.5, 0.19, 0.1)
    .next()
    .select(selectCurrencyPair)
    .next({ highestBid: 40.35 })
    .select(selectUncoveredBuys)
    // [ time, rate, amount, covered ]
    .next([ [ 0, 41, 0.1, 0 ], [ 1, 40.7, 0.1, 0 ] ])
    // update [ 0, 41.2, 0.1, 0 ] to [ 0, 41.2, 0.1, 1 ]
    // do profit 40.4 - 40.2 = 0.2 coins
    .put(botMessage(`Продажа за ${40.3499999} не покрывает ни одной предыдущей покупки.`))
    .next()
    .isDone())

test.skip('checkLastDynamicIsDown should return true on dramatically down', t => {
  const stats = [
    [ 40.5, 2200, 5790, -0.00004848, -0.00003525 ],
    [ 40.1, 2635, 5800, -0.00004016, -0.00003228 ],
    [ 40.2, 2780, 6027, -0.00002966, -0.00002469 ],
    [ 40.3, 2815, 6027, -0.00003145, -0.00002520 ],
    [ 40.4, 2835, 6041, -0.00002876, -0.00002439 ]
  ]

  t.true(checkLastDynamicIsDown(stats))
})

test.skip('checkLastDynamicIsDown should return true on up', t => {
  const stats = [
    [ 40.5, 2200, 5790, -0.00004848, -0.00003525 ],
    [ 40.6, 2635, 5800, -0.00004016, -0.00003228 ],
    [ 40.7, 2880, 5927, -0.00002966, -0.00003469 ],
    [ 40.8, 3015, 6027, -0.00002945, -0.00003520 ],
    [ 40.9, 3535, 6041, -0.00002876, -0.00003439 ]
  ]

  t.false(checkLastDynamicIsDown(stats))
})
