import test from 'ava'
import { testSaga } from 'redux-saga-test-plan'
import { take } from 'redux-saga/effects'
import { buySaga, sellSaga } from 'worker/sagas/trade'
import { selectTransactions, selectSellForCover } from 'worker/sagas/selectors'
import { doBuy, doSell, buySuccess, buyFailure, botMessage } from 'shared/actions'

test('buySaga unit should work correctly', () =>
  testSaga(buySaga, 0.45, 0.01)
    .next()
    .select(selectTransactions)
    .next({
      foo: { rate: 0.47, amount: 0.01 },
      bar: { rate: 0.46, amount: 0.01 },
      baz: { rate: 0.45, amount: 0.01 },
      qux: { rate: 0.44, amount: 0.01 }
    })
    .select(selectSellForCover, 0.46)
    .next('foo')
    .put(doBuy({ rate: 0.45, amount: 0.01, profit: 0.00015, coverId: 'foo' }))
    .next()
    .race({
      success: take(buySuccess),
      failure: take(buyFailure)
    })
    .next({ success: {} })
    .put(botMessage('Куплено за 0.45, покрыто 0.47, объём 0.01, прибыль 0.00015'))
    .next()
    .isDone())
