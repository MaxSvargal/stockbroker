import { fromEvent } from 'most'
import { run } from 'most-test'
import { Subscriber } from 'cote'
import main from './main'

const tick = () => Promise.resolve()
let makeSubscriber, makeRequester, makeBinance, exitProcess, subscriber, account

const accountInfo = {
  balances: [
    { asset: 'BTC', free: '0.00010000', locked: '0.00000000' },
    { asset: 'LTC', free: '1.00000000', locked: '0.00000000' },
    { asset: 'NEO', free: '1.00000000', locked: '0.00000000' },
    { asset: 'ETH', free: '1.00000000', locked: '0.00000000' },
  ]
}
const positions = [
  {
    id: 0,
    orderId: 1,
    created: 1515543340213,
    symbol: 'NEOETH',
    side: 'BUY',
    price: '1.1',
    executedQty: 1
  }, {
    id: 1,
    orderId: 2,
    created: 1515544540654,
    symbol: 'NEOETH',
    side: 'SELL',
    price: '1.2',
    executedQty: 1,
    coveredIds: [ 0 ]
  }, {
    id: 2,
    orderId: 3,
    created: 1515544540656,
    symbol: 'NEOETH',
    side: 'BUY',
    price: '1.2',
    executedQty: '0.05'
  }
].map(JSON.stringify)
const order = {
  symbol: 'NEOETH',
  orderId: 9470272,
  clientOrderId: 'ZIkLmm0pWm1m62wKzrrBzX',
  transactTime: 1515590965088,
  price: '0.00000000',
  origQty: '1.00000000',
  executedQty: '1.00000000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY'
}
const myTrades = [
  {
    id: 4414702,
    orderId: 9470272,
    price: '1.21',
    qty: '1.00000000',
    commission: '0.00000008',
    commissionAsset: 'NEO',
    time: 1515590965088,
    isBuyer: false,
    isMaker: false,
    isBestMatch: true
  }, {
    id: 4415571,
    orderId: 9471743,
    price: '0.00007800',
    qty: '1.00000000',
    commission: '0.00000008',
    commissionAsset: 'ETH',
    time: 1515591307099,
    isBuyer: false,
    isMaker: false,
    isBestMatch: true
  }
]

describe('Binance Account', () => {
  beforeEach(() => {
    makeSubscriber = () => ({
      on: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    })
    makeRequester = ({ positions, saveStatus }: any) => ({
      send: jest.fn()
        .mockReturnValueOnce(Promise.resolve(positions))
        .mockReturnValueOnce(Promise.resolve(saveStatus))
    })
    makeBinance = ({ accountInfo, order, myTrades }) => ({
      accountInfo: jest.fn().mockReturnValue(Promise.resolve(accountInfo)),
      order: jest.fn().mockReturnValue(Promise.resolve(order)),
      myTrades: jest.fn().mockReturnValue(Promise.resolve(myTrades)),
    })
    exitProcess = jest.fn()
    subscriber = makeSubscriber()
    account = 'test'
  })

  test('Position BUY should be created when possible', async () => {
    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions, saveStatus: 'OK' })
    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'BUY', price: 1.1 })

    await tick()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)

    const storeGetAllReq = requesterCalls[0][0]
    expect(storeGetAllReq).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await tick()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(1)
    expect(orderCalls[0]).toEqual([ { symbol: 'NEOETH', side: 'BUY', quantity: '0.30', type: 'MARKET' } ])

    await tick()

    const myTradesCalls = binance.myTrades.mock.calls
    expect(myTradesCalls).toHaveLength(1)
    expect(myTradesCalls[0]).toEqual([ { symbol: 'NEOETH', limit: 10 } ])

    await tick()

    expect(requesterCalls).toHaveLength(2)
    const storeSavePositionsReq = requesterCalls[1][0]
    expect(storeSavePositionsReq).toEqual({
      type: 'cacheHashSet',
      key: 'test:positions',
      field: 4414702,
      value: JSON.stringify({ ...order, ...myTrades[0], coveredIds: null })
    })

  })
  test('Position SELL should be created when possible', async () => {
    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions, saveStatus: 'OK' })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'SELL', price: 1.21 })

    await Promise.resolve()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)
    expect(requesterCalls[0][0]).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await Promise.resolve()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(1)
    expect(orderCalls[0]).toEqual([ { symbol: 'NEOETH', side: 'SELL', quantity: '0.05', type: 'MARKET' } ])

    await Promise.resolve()

    const myTradesCalls = binance.myTrades.mock.calls
    expect(myTradesCalls).toHaveLength(1)
    expect(myTradesCalls[0]).toEqual([ { symbol: 'NEOETH', limit: 10 } ])

    await Promise.resolve()

    expect(requesterCalls).toHaveLength(2)
    expect(requesterCalls[1][0]).toEqual({
      type: 'cacheHashSet',
      key: 'test:positions',
      field: 4414702,
      value: JSON.stringify({ ...order, ...myTrades[0], profit: 0.8333333333333428, coveredIds: [ 2 ] })
    })
  })

  test('Position BUY should NOT be created when too much opened positions', async () => {
    const overPositions = [
      ...positions,
      ...[
        {
          id: 3,
          orderId: 3,
          created: 1515543340213,
          symbol: 'NEOETH',
          side: 'BUY'
        }, {
          id: 4,
          orderId: 4,
          created: 1515544540654,
          symbol: 'NEOETH',
          side: 'BUY'
        }, {
          id: 5,
          orderId: 5,
          created: 1515544540656,
          symbol: 'NEOETH',
          side: 'BUY'
        }
      ].map(JSON.stringify)
    ]

    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions: overPositions, saveStatus: 'OK' })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'BUY', price: 1.2 })

    await tick()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)

    const storeGetAllReq = requesterCalls[0][0]
    expect(storeGetAllReq).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await tick()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(0)

    expect(requesterCalls).toHaveLength(2)
    expect(requesterCalls[1]).toEqual([
      {
        type: 'orderExecutionError',
        account: 'test',
        error: 'Too much opened positions',
        method: 'BUY',
        price: 1.2,
        symbol: 'NEOETH'
      }
    ])
  })
  test('Position BUY should NOT be created when no funds avaliable', async () => {
    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions, saveStatus: 'OK' })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'LTCBTC', type: 'BUY', price: 100 })

    await tick()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)

    const storeGetAllReq = requesterCalls[0][0]
    expect(storeGetAllReq).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await tick()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(0)

    await tick()

    expect(requesterCalls).toHaveLength(2)
    expect(requesterCalls[1]).toEqual([
      {
        type: 'orderExecutionError',
        account: 'test',
        symbol: 'LTCBTC',
        price: 100,
        method: 'BUY',
        error: 'No funds avaliable to buy'
      }
    ])
  })
  test('Position BUY should NOT be created when minimal amount of funds is not isset', async () => {
    const binance = makeBinance({ accountInfo, order, myTrades })
    binance.order = jest.fn().mockReturnValue(Promise.reject('Filter failure: LOT_SIZE'))
    const requester = makeRequester({ positions, saveStatus: 'OK' })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'BUY', price: 1.1 })

    await tick()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)

    const storeGetAllReq = requesterCalls[0][0]
    expect(storeGetAllReq).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await tick()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(1)

    await tick()

    expect(requesterCalls).toHaveLength(2)
    expect(requesterCalls[1]).toEqual([
      {
        type: 'orderExecutionError',
        account: 'test',
        symbol: 'NEOETH',
        method: 'BUY',
        price: 1.1,
        error: 'Filter failure: LOT_SIZE'
      }
    ])
  })
  test('Position SELL should NOT be created when profit not reached', async () => {
    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions, saveStatus: 'OK' })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'SELL', price: 1.1 })

    await Promise.resolve()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)
    expect(requesterCalls[0][0]).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await Promise.resolve()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(0)

    expect(requesterCalls).toHaveLength(2)
    expect(requesterCalls[1]).toEqual([
      {
        type: 'orderExecutionError',
        account: 'test',
        symbol: 'NEOETH',
        method: 'SELL',
        price: 1.1,
        error: 'No position to cover'
      }
    ])
  })
  test('Position SELL should NOT be created when no open positions', async () => {
    const overPositions = positions.slice(0, -1)
    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions: overPositions, saveStatus: 'OK' })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'SELL', price: 1.31 })

    await Promise.resolve()

    const requesterCalls = requester.send.mock.calls
    expect(requesterCalls).toHaveLength(1)
    expect(requesterCalls[0][0]).toEqual({ type: 'cacheHashGetValues', key: 'test:positions' })

    const accountInfoCalls = binance.accountInfo.mock.calls
    expect(accountInfoCalls).toHaveLength(1)

    await Promise.resolve()

    const orderCalls = binance.order.mock.calls
    expect(orderCalls).toHaveLength(0)

    expect(requesterCalls).toHaveLength(2)
    expect(requesterCalls[1]).toEqual([
      {
        type: 'orderExecutionError',
        account: 'test',
        symbol: 'NEOETH',
        method: 'SELL',
        price: 1.31,
        error: 'No position to cover'
      }
    ])
  })
})
