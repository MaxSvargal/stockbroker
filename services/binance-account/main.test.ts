import { fromEvent } from 'most'
import { run } from 'most-test'
import { Subscriber } from 'cote'
import main from './main'

const tick = () => Promise.resolve()
let makeSubscriber, makeRequesterRespondStore, makeRequesterPersistStore, makeBinance, exitProcess, subscriber, account

const accountInfo = {
  balances: [
    { asset: 'BTC', free: '0.00010000', locked: '0.00000000' },
    { asset: 'LTC', free: '1.00000000', locked: '0.00000000' },
    { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
    { asset: 'ETH', free: '1.00000000', locked: '0.00000000' },
    { asset: 'POWR', free: '0.00000000', locked: '0.00000000' }
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
]
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
    makeRequesterRespondStore = ({ activeSymbol, accountActiveSymbols, positions }: any) => ({
      send: jest.fn()
        .mockReturnValueOnce(Promise.resolve(activeSymbol))
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(accountActiveSymbols)))
        .mockReturnValueOnce(Promise.resolve(positions.map(JSON.stringify)))
    })
    makeRequesterPersistStore = ({ position, accountActiveSymbols }: any) => ({
      send: jest.fn()
        .mockReturnValueOnce(Promise.resolve(position))
        .mockReturnValue(Promise.resolve(JSON.stringify(accountActiveSymbols)))
    })
    makeBinance = ({ accountInfo, order, myTrades }) => ({
      accountInfo: jest.fn().mockReturnValue(Promise.resolve(accountInfo)),
      order: jest.fn().mockReturnValue(Promise.resolve(order)),
      myTrades: jest.fn().mockReturnValue(Promise.resolve(myTrades))
    })
    exitProcess = jest.fn()
    subscriber = makeSubscriber()
    account = 'test'
  })

  test('Position BUY should be created when possible', async () => {
    const activeSymbol = 'NEOETH'
    const accountActiveSymbols = [ 'POWRBTC' ]
    const saveStatus = 'OK'
    const position = saveStatus

    const binance = makeBinance({ accountInfo, order, myTrades })
    const requestStore = makeRequesterRespondStore({ activeSymbol, accountActiveSymbols, positions })
    const persistStore = makeRequesterPersistStore({ position, accountActiveSymbols })
    main(exitProcess, binance, subscriber, requestStore, persistStore, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'BUY', price: 1.1 })

    await tick()

    expect(requestStore.send).toHaveBeenCalledTimes(1)
    expect(requestStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol'
    })

    await tick()

    expect(requestStore.send).toHaveBeenCalledTimes(3)
    expect(requestStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'accounts:activeSymbols', field: 'test'
    })
    expect(requestStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGetValues', key: 'accounts:test:positions'
    })
    expect(binance.accountInfo).toHaveBeenCalledTimes(1)
    expect(binance.accountInfo).toHaveBeenCalledWith(null)

    await tick()

    expect(binance.order).toHaveBeenCalledTimes(1)
    expect(binance.order).toHaveBeenCalledWith({
      symbol: 'NEOETH', side: 'BUY', quantity: '0.12', type: 'MARKET'
    })

    await tick()

    expect(binance.myTrades).toHaveBeenCalledTimes(1)
    expect(binance.myTrades).toHaveBeenCalledWith({
      symbol: 'NEOETH', limit: 10
    })

    await tick()

    expect(persistStore.send).toHaveBeenCalledTimes(1)
    expect(persistStore.send).toHaveBeenLastCalledWith({
      type: 'cacheHashSet',
      key: 'accounts:test:positions',
      field: 4414702,
      value: JSON.stringify({ ...order, ...myTrades[0], coveredIds: null })
    })

    await tick()

    expect(persistStore.send).toHaveBeenCalledTimes(2)
    expect(persistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet', key: 'accounts:activeSymbols', field: 'test', value: '[\"POWRBTC\",\"NEOETH\"]'
    })
  })
  test('Position SELL should be created when possible', async () => {
    const activeSymbol = 'POWRBTC'
    const accountActiveSymbols = [ 'NEOETH', 'POWRBTC' ]
    const saveStatus = 'OK'
    const position = saveStatus
    const overOrder = {
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
      side: 'SELL'
    }

    const binance = makeBinance({ accountInfo, order: overOrder, myTrades })
    const requestStore = makeRequesterRespondStore({ activeSymbol, accountActiveSymbols, positions })
    const persistStore = makeRequesterPersistStore({ position, accountActiveSymbols })
    main(exitProcess, binance, subscriber, requestStore, persistStore, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'SELL', price: 1.21 })

    await tick()

    expect(requestStore.send).toHaveBeenCalledTimes(1)
    expect(requestStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol'
    })

    await tick()

    expect(requestStore.send).toHaveBeenCalledTimes(3)
    expect(requestStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'accounts:activeSymbols', field: 'test'
    })
    expect(requestStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGetValues', key: 'accounts:test:positions'
    })
    expect(binance.accountInfo).toHaveBeenCalledTimes(1)
    expect(binance.accountInfo).toHaveBeenCalledWith(null)

    await tick()

    expect(binance.order).toHaveBeenCalledTimes(1)
    expect(binance.order).toHaveBeenCalledWith({
      symbol: 'NEOETH', side: 'SELL', quantity: '0.05', type: 'MARKET'
    })

    await tick()

    expect(binance.myTrades).toHaveBeenCalledTimes(1)
    expect(binance.myTrades).toHaveBeenCalledWith({
      symbol: 'NEOETH', limit: 10
    })

    await tick()

    expect(persistStore.send).toHaveBeenCalledTimes(1)
    expect(persistStore.send).toHaveBeenLastCalledWith({
      type: 'cacheHashSet',
      key: 'accounts:test:positions',
      field: 4414702,
      value: JSON.stringify({
        ...order,
        ...myTrades[0],
        side: 'SELL',
        profit: 0.8333333333333428,
        coveredIds: [ 2 ]
      })
    })

    await tick()

    expect(persistStore.send).toHaveBeenCalledTimes(2)
    expect(persistStore.send).toHaveBeenLastCalledWith({
      type: 'cacheHashSet',
      key: 'accounts:activeSymbols',
      field: 'test',
      value: '[\"POWRBTC\"]'
    })
  })

  test.skip('Position BUY should NOT be created when signal symbol is not equal global activeSymbol', async () => {
    const activeSymbol = 'NEOETH'
    const accountActiveSymbols = [ 'POWRETH', 'NEOETH' ]
    const saveStatus = 'OK'

    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions, activeSymbol, accountActiveSymbols, saveStatus })
    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'POWRETH', type: 'BUY', price: 1.1 })

    await tick()

    expect(requester.send).toHaveBeenCalledTimes(1)
    expect(requester.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol'
    })

    await tick()

    expect(requester.send).toHaveBeenCalledTimes(2)
    expect(requester.send).toHaveBeenCalledWith({
      type: 'orderExecutionError',
      account: 'test',
      error: 'Symbol POWRETH is not active, skip BUY signal.',
      method: 'BUY',
      price: 1.1,
      symbol: 'POWRETH'
    })

    await tick()

    expect(binance.accountInfo).toHaveBeenCalledTimes(0)
    expect(binance.order).toHaveBeenCalledTimes(0)
    expect(binance.myTrades).toHaveBeenCalledTimes(0)
    expect(requester.send).toHaveBeenCalledTimes(2)
  })
  test.skip('Position BUY should NOT be created when too much opened positions', async () => {
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
    const activeSymbol = 'NEOETH'
    const accountActiveSymbols = [ 'POWRETH', 'NEOETH' ]
    const saveStatus = 'OK'

    const binance = makeBinance({ accountInfo, order, myTrades })
    const requester = makeRequester({ positions: overPositions, activeSymbol, accountActiveSymbols, saveStatus })

    main(exitProcess, binance, subscriber, requester, account)

    const listenersCalls = subscriber.addListener.mock.calls
    const propagateSignal = listenersCalls[0][1]
    expect(listenersCalls).toHaveLength(1)
    propagateSignal({ symbol: 'NEOETH', type: 'BUY', price: 1.2 })

    await tick()

    expect(requester.send).toHaveBeenCalledTimes(1)
    expect(requester.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol'
    })

    await tick()

    expect(requester.send).toHaveBeenCalledTimes(3)
    expect(requester.send).toHaveBeenCalledWith({
      type: 'cacheHashGet', key: 'accounts:activeSymbols', field: 'test'
    })
    expect(requester.send).toHaveBeenCalledWith({
      type: 'cacheHashGetValues', key: 'test:positions'
    })
    expect(binance.accountInfo).toHaveBeenCalledTimes(1)
    expect(binance.accountInfo).toHaveBeenCalledWith(null)

    await tick()

    expect(binance.order).toHaveBeenCalledTimes(0)
    expect(binance.myTrades).toHaveBeenCalledTimes(0)

    expect(requester.send).toHaveBeenCalledTimes(4)
    expect(requester.send).toHaveBeenLastCalledWith({
      type: 'orderExecutionError',
      account: 'test',
      error: 'Too much opened positions',
      method: 'BUY',
      price: 1.2,
      symbol: 'NEOETH'
    })
  })
  test.skip('Position BUY should NOT be created when no funds avaliable', async () => {})
  test.skip('Position BUY should NOT be created when minimal amount of funds is not isset', async () => {
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
  test.skip('Position SELL should NOT be created when profit not reached', async () => {
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
  test.skip('Position SELL should NOT be created when no open positions', async () => {
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
