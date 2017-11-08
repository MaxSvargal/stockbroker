import { testSaga, expectSaga } from 'redux-saga-test-plan'
import { tradeSequenceSaga, treadeRequestSequenceSaga } from '../tradeSequence'
import { selectAmountToBuy, selectAmountToSell } from 'shared/sagas/selectors'
import { requestTradeSequenceSaga, requestNewPassiveOrder } from 'shared/actions'

const providers = () => {
  let counter = 0
  return {
    take(props: any, next: () => void) {
      return counter === 0 ? counter++ : next()
    }
  }
}

test('treadeRequestSequenceSaga should calculate orders count and amount', () => {
  const storeState = {
    wallet: {
      exchange: {
        BTC: { balanceAvaliable: 0.2 },
        USD: { balanceAvaliable: 120 }
      },
      tickers: {
        BTCUSD: [ 4100, 1, 4101, 1, 1, 1, 4100, 1, 4102, 4099 ]
      },
      stochastic: [
        [ 1507593509440, 83 ],
        [ 1507593509441, 82 ],
        [ 1507593509442, 81 ]
      ]
    }
  }

  expectSaga(requestTradeSequenceSaga, 'tBTCUSD', 'sell')
    .withState(storeState)
    .provide(providers())
    .put(requestOrdersSequence({ symbol: 'tBTCUSD', amount: -0.005, chunks: 2 }))
    .run()
})

test('requestTradeSequenceSaga should run tradeSequenceSaga in loop', () => {
  testSaga(requestTradeSequenceSaga)
})

test.skip('tradeSequenceSaga should fork passive orders in sequence', () => {
  testSaga(tradeSequenceSaga)
    .next()
    .take(requestOrdersSequence)
    .next({ payload : { symbol: 'tBTCUSD', amount: 0.01, chunks: 2 } })
    .put(requestNewPassiveOrder({ symbol: 'tBTCUSD', amount: 0.005, cid: 12345 }))
    .next(12345)
    .take(orderExecuted)
    .next({ payload: { cid: 12345, price: 4100 } })
    .put(requestNewPassiveOrder({ symbol: 'tBTCUSD', amount: 0.005, cid: 54321 }))
    .next(54321)
    .take(orderExecuted)
    .next({ payload: { cid: 12345, price: 55.5 } })
    .take(orderExecuted)
    .next({ payload: { cid: 54321, price: 4099 } })
    .take(requestOrdersSequence)
})
