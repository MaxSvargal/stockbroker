import { expectSaga } from 'redux-saga-test-plan'
import { doBuySaga, doSellSaga } from '../wallet'
import { createPosition, updateMyTrade } from 'shared/actions'

const symbol = 'tBTCUSD'
const orderId = 10
const amount = 0.005

test('doBuySaga should work correctly', () => {
  const state = {
    asks: {
      6001: [ 6001, 1, 2 ],
      6000: [ 6000, 1, 2 ]
    }
  }

  // [ ID, PAIR, MTS_CREATE, ORDER_ID, EXEC_AMOUNT, EXEC_PRICE, ORDER_TYPE, ORDER_PRICE, MAKER, FEE, FEE_CURRENCY ]

  return expectSaga(doBuySaga, symbol, 0)
    .withState(state)
    .put(createPosition({ symbol, price: 6000, amount, cid: 0, id: 0, mts: 0 }))
    .dispatch(updateMyTrade([ 100500, 'BTCUSD', 1509633968541, orderId, amount, 6000, 'EXCHANGE LIMIT', 6000, 1, 0.002, 'USD' ]))
    .run()
})
