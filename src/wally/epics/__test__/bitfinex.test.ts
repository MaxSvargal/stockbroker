import { run } from 'shared/test/utils'
import { Action } from 'shared/types'
import { bitfinexConnected, orderCreate, orderCancel, updateMyTrade, createPosition, signalRequest, signalRequestResolved, signalRequestRejected } from 'shared/actions'
import { newOrder, resolveOrderRequest } from '../bitfinex'

const ws = { send: (msg: Action) => undefined }

test('Order flow should handle resolved signal request to sell and return create position to sell', () => {
  run(
    newOrder,
    {},
    '-a-b-c--d-',
    '--------z-',
    {
      a: bitfinexConnected(ws),
      b: signalRequestResolved({ type: 'sell', symbol: 'tDATUSD', from: 'mcrasta', meta: { status: true, amount: -158, price: 0.071813, covered: [ [ 100500, 1, 70 ] ] } }),
      c: orderCancel([ 5286711746, 'DATUSD', 0, -158,'EXCHANGE LIMIT', "EXECUTED @ 0.0733(-158.0)", 0.071813, 0.07326, '2017-11-20T00:15:02Z', 0, 0, 0 ]),
      d: updateMyTrade([ '65030-DATUSD', 96223626, 'DATUSD', 1511136902, 5286711746, -158, 0.07326, 'EXCHANGE LIMIT', 0.071813, -0.00005244, 'DAT' ]),
    },
    {
      z: createPosition({
        id: 96223626,
        pair: 'DATUSD',
        mts: 1511136902,
        orderId: 5286711746,
        amount: -158,
        price: 0.07326,
        orderType: 'EXCHANGE LIMIT',
        orderPrice: 0.071813,
        fee: -0.00005244,
        feeCurrency: 'DAT',
        profit: 0,
        covered: [ [ 100500, 1, 70 ] ]
      })
    }
  )
})

test('Order flow should handle resolved signal request to buy and return create position to buy', () => {
  run(
    newOrder,
    {},
    '-a-b-c--d-',
    '--------z-',
    {
      a: bitfinexConnected(ws),
      b: signalRequestResolved({ type: 'buy', symbol: 'tDATUSD', from: 'mcrasta', meta: { status: true, amount: 158, price: 0.071813 } }),
      c: orderCancel([ 5286711746, 'DATUSD', 0, 158,'EXCHANGE LIMIT', "EXECUTED @ 0.0733(158.0)", 0.071813, 0.07326, '2017-11-20T00:15:02Z', 0, 0, 0 ]),
      d: updateMyTrade([ '65030-DATUSD', 96223626, 'DATUSD', 1511136902, 5286711746, 158, 0.07326, 'EXCHANGE LIMIT', 0.071813, -0.00005244, 'USD' ]),
    },
    {
      z: createPosition({
        id: 96223626,
        pair: 'DATUSD',
        mts: 1511136902,
        orderId: 5286711746,
        amount: 158,
        price: 0.07326,
        orderType: 'EXCHANGE LIMIT',
        orderPrice: 0.071813,
        fee: -0.00005244,
        feeCurrency: 'USD'
      })
    }
  )
})

test('resolveOrderRequest should approve when funds avaliable', () => {
  const requestOptions = {
    usePercentOfFund: 1,
    maxChunksNumber: 4,
    minChunkAmount: 0.5,
    minThreshold: 0.01
  }
  run(
    resolveOrderRequest,
    {
      wallet: { exchange: { BTC: { balance: 2.98 }, USD: { balance: 110 } } },
      bids: {
        101: [ 101, 1, 20 ],
        100: [ 100, 1, 30 ],
        102: [ 102, 1, 10 ]
      },
      asks: {
        103: [ 103, 1, 20 ],
        105: [ 105, 1, 30 ],
        104: [ 104, 1, 10 ]
      },
      positions: [
        { pair: 'BTCUSD', id: 100500, mts: 1511020433555, price: 70, amount: 1 },
        { pair: 'BTCUSD', id: 100501, mts: 1511020433556, price: 110, amount: 1 },
        { pair: 'BTCUSD', id: 100502, mts: 1511020433557, price: 120, amount: 1 }
      ]
    },
    '-a-b',
    '-a-b',
    {
      a: signalRequest({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta', options: requestOptions }),
      b: signalRequest({ type: 'sell', symbol: 'tBTCUSD', from: 'mcrasta', options: requestOptions })
    },
    {
      a: signalRequestResolved({
        type: 'buy',
        symbol: 'tBTCUSD',
        from: 'mcrasta',
        options: requestOptions,
        meta: { status: true, amount: 1.048, price: 103 }
      }),
      b: signalRequestResolved({
        type: 'sell',
        symbol: 'tBTCUSD',
        from: 'mcrasta',
        options: requestOptions,
        meta: { status: true, amount: -1, price: 102, covered: [ [ 100500, 1, 70 ] ] }
      })
    }
  )
})

test('resolveOrderRequest should reject when no funds avaliable', () => {
  const requestOptions = {
    usePercentOfFund: 1,
    maxChunksNumber: 4,
    minChunkAmount: 0.5,
    minThreshold: 0.1
  }
  run(
    resolveOrderRequest,
    {
      wallet: { exchange: { BTC: { balance: 2.9 }, USD: { balance: 10 } } },
      bids: {
        99: [ 99, 1, 20 ],
        100: [ 100, 1, 30 ],
        98: [ 98, 1, 10 ]
      },
      positions: [
        { symbol: 'tBTCUSD', id: 100500, mts: 1511020433555, price: 100, amount: 1 }
      ]
    },
    '-a-b',
    '-a-b',
    {
      a: signalRequest({ type: 'buy', symbol: 'tBTCUSD', from: 'mcrasta', options: requestOptions }),
      b: signalRequest({ type: 'sell', symbol: 'tBTCUSD', from: 'mcrasta', options: requestOptions })
    },
    {
      a: signalRequestRejected({
        type: 'buy',
        symbol: 'tBTCUSD',
        from: 'mcrasta',
        options: requestOptions,
        meta: { status: false, reason: 'No funds avaliable' }
      }),
      b: signalRequestRejected({
        type: 'sell',
        symbol: 'tBTCUSD',
        from: 'mcrasta',
        options: requestOptions,
        meta: { status: false, reason: 'No position to cover' }
      })
    }
  )
})
