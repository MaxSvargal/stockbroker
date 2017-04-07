import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import { generateStatsSaga } from 'server/sagas/stats'
import { selectSellsLastTime, selectBuysLastTime, selectCurrencyProps } from 'server/sagas/selectors'
import { addStats } from 'shared/actions'
import { TEN_MINUTES } from 'const'

test('generateStatsSaga should store statistics', () => {
  const buys = [ [ 0, 0.4, 1 ], [ 2, 0.5, 2 ], [ 4, 0.6, 2 ], [ 6, 0.9, 1 ] ]
  const sells = [ [ 1, 0.3, 1 ], [ 3, 0.4, 1 ], [ 5, 0.5, 1 ] ]
  const totals = [ 0.56, 0.9875, 0.861111111111111 ]

  testSaga(generateStatsSaga)
    .next()
    .select(selectCurrencyProps)
    .next({ last: '0.56' })
    .select(selectBuysLastTime, TEN_MINUTES)
    .next(buys)
    .select(selectSellsLastTime, TEN_MINUTES)
    .next(sells)
    .put(addStats(totals))
    .next()
    .isDone()
})
