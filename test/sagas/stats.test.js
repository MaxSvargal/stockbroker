import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import { generateStatsSaga } from 'sagas/stats'
import { selectSellsLastTime, selectBuysLastTime, selectCurrencyPair } from 'sagas/selectors'
import { addStats } from 'actions'
import { FIVE_MINUTES, CURRENT_PAIR } from 'const'

test('generateStatsSaga should calculate statistics on buy up, sell down', () => {
  const buy = [ [ 0, 0.4, 1 ], [ 2, 0.5, 2 ], [ 4, 0.6, 2 ] ]
  const sell = [ [ 1, 0.3, 1 ], [ 3, 0.4, 1 ], [ 5, 0.5, 1 ] ]
  // [ buyVolume, sellVolume, buyChange, sellChange ]
  const totals = [ 0.5, 5, 3, 0.06666666666666665, 0.08333333333333336 ]

  testSaga(generateStatsSaga)
    .next()
    .select(selectSellsLastTime, FIVE_MINUTES)
    .next(sell)
    .select(selectBuysLastTime, FIVE_MINUTES)
    .next(buy)
    .select(selectCurrencyPair, CURRENT_PAIR)
    .next({ last: 0.5 })
    .put(addStats(totals))
})

test('generateStatsSaga should calculate statistics on sell up (dumping down)', () => {
  const buy = [ [ 0, 0.4, 3 ], [ 2, 0.4, 2 ], [ 4, 0.4, 1 ] ]
  const sell = [ [ 1, 0.3, 2 ], [ 3, 0.2, 3 ], [ 5, 0.1, 4 ] ]
  const totals = [ 0.1, 6, 9, 0, -0.16666666666666663 ]

  testSaga(generateStatsSaga)
    .next()
    .select(selectSellsLastTime, FIVE_MINUTES)
    .next(sell)
    .select(selectBuysLastTime, FIVE_MINUTES)
    .next(buy)
    .select(selectCurrencyPair, CURRENT_PAIR)
    .next({ last: 0.1 })
    .put(addStats(totals))
})

test('generateStatsSaga should calculate statistics on buy up (dumping up)', () => {
  const buy = [ [ 0, 0.5, 5 ], [ 2, 0.6, 5 ], [ 4, 0.7, 5 ] ]
  const sell = [ [ 1, 0.3, 3 ], [ 3, 0.6, 3 ], [ 5, 0.7, 3 ] ]
  const totals = [ 0.7, 15, 9, 0.055555555555555546, 0.16666666666666666 ]

  testSaga(generateStatsSaga)
    .next()
    .select(selectSellsLastTime, FIVE_MINUTES)
    .next(sell)
    .select(selectBuysLastTime, FIVE_MINUTES)
    .next(buy)
    .select(selectCurrencyPair, CURRENT_PAIR)
    .next({ last: 0.7 })
    .put(addStats(totals))
})
