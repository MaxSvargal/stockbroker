import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { take } from 'redux-saga-test-plan/matchers'

import { updateBuyOrderSaga, updateSellOrderSaga, tradeLoopSaga, checkIntervalChannel } from '../tradeInOrderbook'
import { execCancelOrder, execNewOrder } from 'shared/actions'

const providers = () => {
  let counter = 0
  return {
    take(props: any, next: () => void) {
      return counter === 0 ? counter++ : next()
    }
  }
}

const orders = {
  4175120013: [ 4175120013, 1, 62639669146, 'tBTCUSD', 1507310639764, 1507310639780, 0.01, 0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'EXECUTED', null, null, 4404.9, 0, 0, 0, null, null, null, 0, 0, 0 ],
  4175257488: [ 4175257488, 1, 63355155220, 'tBTCUSD', 1507311364938, 1507311365009, 0.01, 0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, 4401.9, 0, 0, 0, null, null, null, 0, 0, 0 ]
}

test('tradeLoopSaga should recreate buy order when bid got down', () => {
  const storeState = {
    orders,
    orderbook: {
      bid: {
        '4401.6': [ 4401.6, 1, 0.5 ],
        '4401.5': [ 4401.5, 1, 0.5 ],
        '4401.4': [ 4401.4, 2, 1 ]
      }
    }
  }

  return expectSaga(tradeLoopSaga, 'tBTCUSD', 0.005)
    .withState(storeState)
    .provide(providers())
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: 0.005, price: 4401.7 }))
    .put(execCancelOrder({ id: 4175257488 }))
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: 0.01, price: 4401.7 }))
    .silentRun(1)
})

test('tradeLoopSaga should recreate buy order when bid is too expensive', () => {
  const storeState = {
    orders,
    orderbook: {
      bid: {
        '4401.9': [ 4401.9, 1, 0.5 ],
        '4401.5': [ 4401.5, 1, 0.5 ],
        '4401.4': [ 4401.4, 2, 1 ]
      }
    }
  }

  return expectSaga(tradeLoopSaga, 'tBTCUSD', 0.005)
    .withState(storeState)
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: 0.005, price: 4402 }))
    .provide(providers())
    .put(execCancelOrder({ id: 4175257488 }))
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: 0.01, price: 4401.6 }))
    .silentRun(1)
})

test('tradeLoopSaga should return from loop when active buy order is not isset', () => {
  const storeState = {
    orderbook: {
      bid: {
        '4401.9': [ 4401.9, 1, 0.5 ],
        '4401.5': [ 4401.5, 1, 0.5 ],
        '4401.4': [ 4401.4, 2, 1 ]
      }
    },
    orders: {
      4175120013: [ 4175120013, 1, 62639669146, 'tBTCUSD', 1507310639764, 1507310639780, 0.01, 0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'EXECUTED', null, null, 4404.9, 0, 0, 0, null, null, null, 0, 0, 0 ],
      4175257488: [ 4175257488, 1, 63355155220, 'tBTCUSD', 1507311364938, 1507311365009, 0.01, 0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'EXECUTED', null, null, 4401.9, 0, 0, 0, null, null, null, 0, 0, 0 ]
    }
  }

  return expectSaga(tradeLoopSaga, 'tBTCUSD', 0.005)
    .withState(storeState)
    .provide(providers())
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: 0.005, price: 4402 }))
    .run()
})

test('tradeLoopSaga should recreate sell order when ask got down', () => {
  const storeState = {
    orderbook: {
      ask: {
        '4401.4': [ 4401.4, 1, 0.5 ],
        '4401.5': [ 4401.5, 1, 0.5 ],
        '4401.6': [ 4401.6, 2, 1 ]
      }
    },
    orders: {
      4175120013: [ 4175120013, 1, 62639669146, 'tBTCUSD', 1507310639764, 1507310639780, -0.01, -0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'EXECUTED', null, null, 4404.9, 0, 0, 0, null, null, null, 0, 0, 0 ],
      4175257488: [ 4175257488, 1, 63355155220, 'tBTCUSD', 1507311364938, 1507311365009, -0.01, -0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, 4401.5, 0, 0, 0, null, null, null, 0, 0, 0 ]
    }
  }

  return expectSaga(tradeLoopSaga, 'tBTCUSD', -0.005)
    .withState(storeState)
    .provide(providers())
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: -0.005, price: 4401.3 }))
    .put(execCancelOrder({ id: 4175257488 }))
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: -0.01, price: 4401.3 }))
    .silentRun(1)
})

test('tradeLoopSaga should recreate sell order when ask is too cheap', () => {
  const storeState = {
    orderbook: {
      ask: {
        '4401.2': [ 4401.2, 1, 0.5 ],
        '4401.5': [ 4401.5, 1, 0.5 ],
        '4401.6': [ 4401.6, 2, 1 ]
      }
    },
    orders: {
      4175120013: [ 4175120013, 1, 62639669146, 'tBTCUSD', 1507310639764, 1507310639780, -0.01, -0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'EXECUTED', null, null, 4404.9, 0, 0, 0, null, null, null, 0, 0, 0 ],
      4175257488: [ 4175257488, 1, 63355155220, 'tBTCUSD', 1507311364938, 1507311365009, -0.01, -0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'ACTIVE', null, null, 4401.2, 0, 0, 0, null, null, null, 0, 0, 0 ]
    }
  }

  return expectSaga(tradeLoopSaga, 'tBTCUSD', -0.005)
    .withState(storeState)
    .provide(providers())
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: -0.005, price: 4401.1 }))
    .put(execCancelOrder({ id: 4175257488 }))
    .put(execNewOrder({ symbol: 'tBTCUSD', amount: -0.01, price: 4401.4 }))
    .silentRun(1)
})

test('tradeLoopSaga should return from loop when active sell order is not isset', () => {
  const storeState = {
    orderbook: {
      ask: {
        '4401.4': [ 4401.4, 1, 0.5 ],
        '4401.5': [ 4401.5, 1, 0.5 ],
        '4401.6': [ 4401.6, 2, 1 ]
      }
    },
    orders: {
      4175120013: [ 4175120013, 1, 62639669146, 'tBTCUSD', 1507310639764, 1507310639780, 0.01, 0.01, 'EXCHANGE LIMIT', null, null, null, 0, 'EXECUTED', null, null, 4404.9, 0, 0, 0, null, null, null, 0, 0, 0 ]
    }
  }

  return expectSaga(tradeLoopSaga, 'tBTCUSD', -0.005)
    .withState(storeState)
      .provide(providers())
      .put(execNewOrder({ symbol: 'tBTCUSD', amount: -0.005, price: 4401.3 }))
      .run()
})
