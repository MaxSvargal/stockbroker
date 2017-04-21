import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import { generateStatsSaga, estimateStatsSaga } from 'worker/sagas/stats'
import { selectSellsLastTime, selectBuysLastTime, selectCurrencyProps, selectLastFiveStats, selectStopTrade, selectProfitThreshold } from 'worker/sagas/selectors'
import { sellSaga, buySaga } from 'worker/sagas/trade'
import { addStats, addStatsDynamics } from 'shared/actions'

const FIVE_MINUTES = 1000 * 60 * 5

test('generateStatsSaga should store statistics', () => {
  const buys = [ [ 0, 0.4, 1 ], [ 2, 0.5, 2 ], [ 4, 0.6, 2 ], [ 6, 0.9, 1 ] ]
  const sells = [ [ 1, 0.3, 1 ], [ 3, 0.4, 1 ], [ 5, 0.5, 1 ], [ 7, 0.7, 1 ] ]
  const totals = [ 0.56, 0.9875, 0.9958333325, 0.9, 0.7 ]

  testSaga(generateStatsSaga)
    .next()
    .select(selectBuysLastTime, FIVE_MINUTES)
    .next(buys)
    .select(selectSellsLastTime, FIVE_MINUTES)
    .next(sells)
    .select(selectCurrencyProps)
    .next({ last: '0.56' })
    .put(addStats(totals))
    .next()
    .isDone()
})

test.skip('estimateStatsSaga should generate and store stats dynamics', () =>
  testSaga(estimateStatsSaga)
    .next()
    .take(addStats)
    .next()
    .select(selectLastFiveStats)
    .next([
      [ 0.5, 0.50, 0.51 ],
      [ 0.5, 0.51, 0.52 ],
      [ 0.5, 0.52, 0.52 ],
      [ 0.5, 0.51, 0.50 ],
      [ 0.5, 0.50, 0.51 ],
      [ 0.5, 0.51, 0.52 ],
      [ 0.5, 0.52, 0.53 ],
      [ 0.5, 0.53, 0.53 ],
      [ 0.5, 0.54, 0.54 ],
      [ 0.5, 0.55, 0.55 ]
    ])
    .select(selectStopTrade)
    .next(false)
    .select(selectProfitThreshold)
    .next(0.01)
    .fork(sellSaga)
    .next()
    .fork(buySaga)
    .next()
    .put(addStatsDynamics({ buysDyn: 1, sellsDyn: 1 }))
    .next()
    .take(addStats))
