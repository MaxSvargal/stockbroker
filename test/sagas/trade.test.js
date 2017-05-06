import test from 'ava'
import { testSaga } from 'redux-saga-test-plan'
import { take } from 'redux-saga/effects'
import { buySaga, sellSaga } from 'worker/sagas/trade'
import { selectTransactions, selectSellForCover, selectBuyForCover } from 'worker/sagas/selectors'
import { addMessage, doBuy, doSell, buySuccess, buyFailure, sellSuccess, sellFailure } from 'shared/actions'

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
    .put(addMessage('transaction', { action: 'buy', rate: 0.45, coveredRate: 0.47, coveredAmount: 0.01, profit: 0.00015 }))
    .next()
    .isDone())

test('sellSaga unit should work correctly', () =>
  testSaga(sellSaga, 0.47, 0.01)
    .next()
    .select(selectTransactions)
    .next({
      foo: { rate: 0.47, amount: 0.01 },
      bar: { rate: 0.46, amount: 0.01 },
      baz: { rate: 0.45, amount: 0.01 },
      qux: { rate: 0.44, amount: 0.01 }
    })
    .select(selectBuyForCover, 0.46)
    .next('qux')
    .put(doSell({ rate: 0.47, amount: 0.01, profit: 0.000225, coverId: 'qux' }))
    .next()
    .race({
      success: take(sellSuccess),
      failure: take(sellFailure)
    })
    .next({ success: {} })
    .put(addMessage('transaction', { action: 'sell', rate: 0.47, coveredRate: 0.44, coveredAmount: 0.01, profit: 0.000225 }))
    .next()
    .isDone())
