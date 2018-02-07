import main from './checkOrderSignal'

const resolve = (data: any) => jest.fn().mockReturnValue(Promise.resolve(data))
const tick = () => Promise.resolve()
// const resolveJson = (data: any) => Promise.resolve(JSON.stringify(data))
// const resolveJsonList = (data: any) => Promise.resolve(data.map(JSON.stringify))
// const resolve = (data: any) => Promise.resolve(data)
// const mockOncePromiseJson = (data: any) => jest.fn().mockReturnValueOnce(resolveJson(data))
// const mockOncePromiseJsonList = (data: any) => jest.fn().mockReturnValueOnce(resolveJsonList(data))
// const mockOncePromise = (data: any) => jest.fn().mockReturnValueOnce(resolve(data))

describe('Exchange Account: Check Order Signal', () => {
  test('should send BUY order and store position correctly', async () => {
    const account = 'test'
    const signal = { symbol: 'ETHBTC', side: 'BUY', price: 0.1 }
    const requests = {
      openPosition: resolve({ inserted: 1 }),
      closePosition: resolve({ updated: 1 }),
      getSymbolsEnabled: resolve({ values: [ 'ETHBTC', 'MCOBTC' ] }),
      setAccountSymbols: resolve({ updated: 1 }),
      getAccount: resolve({
        name: 'test',
        activeSymbols: [],
        preferences: {
          chunksNumber: 8,
          profitMin: 0.015,
          stopLimitPerc: 0.01
        }
      }),
      getOpenedPositions: resolve([
        {
          id: 0,
          account: 'test',
          symbol: 'ETHBTC',
          closed: false,
          open: {
            id: 10,
            orderId: 100,
            origQty: 1,
            quantity: 2,
            price: 1.1,
            time: new Date(1515543340213),
            comission: 0.00011,
            comissionAsset: 'ETH'
          }
        }, {
          id: 1,
          account: 'test',
          symbol: 'NEOBTC',
          closed: false,
          open: {
            id: 11,
            orderId: 111,
            origQty: 1,
            quantity: 2,
            price: 1.2,
            time: new Date(1515543340214),
            comission: 0.00012,
            comissionAsset: 'NEO'
          }
        }
      ]),
      getSymbolInfo: resolve({
        symbol: 'ETHBTC',
        status: 'TRADING',
        baseAsset: 'ETH',
        baseAssetPrecision: 8,
        quoteAsset: 'BTC',
        quotePrecision: 8,
        icebergAllowed: true,
        filters: [
          {
            filterType: 'PRICE_FILTER',
             minPrice: '0.00000001',
             maxPrice: '100000.00000000',
             tickSize: '0.00000001'
          },
          {
            filterType: 'LOT_SIZE',
             minQty: '0.00100000',
             maxQty: '90000000.00000000',
             stepSize: '0.00100000'
          },
          {
            filterType: 'MIN_NOTIONAL',
            minNotional: '0.00200000'
          }
        ]
      }),
      accountInfo: resolve({
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' },
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '1.00000000', locked: '0.00000000' }
        ]
      }),
      sendOrder: resolve({
        symbol: 'ETHBTC',
        orderId: 9470272,
        transactTime: 1515590965088,
        price: '0.00000000',
        origQty: '1.00000000',
        executedQty: '1.00000000',
        side: 'BUY'
      }),
      myTrades: resolve([
        {
          id: 4414702,
          orderId: 9470272,
          price: '0.002',
          qty: '1.00000000',
          commission: '0.00000008',
          commissionAsset: 'ETH',
          time: 1515590965088,
          isBuyer: false,
          isMaker: false,
          isBestMatch: true
        }, {
          id: 4415571,
          orderId: 9471743,
          price: '0.002',
          qty: '1.00000000',
          commission: '0.00000008',
          commissionAsset: 'ETH',
          time: 1515591307099,
          isBuyer: false,
          isMaker: false,
          isBestMatch: true
        }
      ])
    }

    await main(account, requests)(signal)

    expect(requests.getSymbolInfo).toHaveBeenCalledTimes(1)
    expect(requests.getSymbolInfo).toHaveBeenCalledWith('ETHBTC')
    expect(requests.getOpenedPositions).toHaveBeenCalledTimes(1)
    expect(requests.getOpenedPositions).toHaveBeenCalledWith(null)
    expect(requests.getAccount).toHaveBeenCalledTimes(1)
    expect(requests.getAccount).toHaveBeenCalledWith(null)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledWith(null)

    expect(requests.sendOrder).toHaveBeenCalledTimes(1)
    expect(requests.sendOrder).toHaveBeenCalledWith({
      quantity: 0.183,
      side: 'BUY',
      symbol: 'ETHBTC',
      type: 'MARKET'
    })

    expect(requests.myTrades).toHaveBeenCalledTimes(1)
    expect(requests.myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'ETHBTC' })

    expect(requests.openPosition).toHaveBeenCalledTimes(1)
    expect(requests.openPosition).toHaveBeenCalledWith({
      account: 'test',
      symbol: 'ETHBTC',
      closed: false,
      open: {
        id: 4414702,
        orderId: 9470272,
        origQty: 1,
        price: 0.002,
        qty: 1,
        time: new Date('2018-01-10T13:29:25.088Z'),
        commission: 0.00000008,
        commissionAsset: 'ETH'
      }
    })

    expect(requests.setAccountSymbols).toHaveBeenCalledTimes(1)
    expect(requests.setAccountSymbols).toHaveBeenCalledWith([ 'ETHBTC' ])
  })
  test('should NOT send BUY order when symbols is not enabled', async () => {
    const account = 'test'
    const signal = { symbol: 'NEOBTC', side: 'BUY', price: 0.002 }
    const requests = {
      getSymbolsEnabled: resolve({ values: [ 'ETHBTC', 'MCOBTC' ] }),
      getSymbolInfo: resolve(null),
      getOpenedPositions: resolve(null),
      getAccount: resolve(null),
      accountInfo: resolve(null),
    }

    await main(account, requests)(signal)

    expect(requests.getSymbolsEnabled).toHaveBeenCalledTimes(1)
    expect(requests.getSymbolsEnabled).toHaveBeenCalledWith(null)

    expect(requests.getSymbolInfo).toHaveBeenCalledTimes(0)
    expect(requests.getOpenedPositions).toHaveBeenCalledTimes(0)
    expect(requests.getAccount).toHaveBeenCalledTimes(0)
    expect(requests.accountInfo).toHaveBeenCalledTimes(0)
  })
  test('should send SELL order and store position correctly', async () => {
    const account = 'test'
    const signal = { symbol: 'ETHBTC', side: 'SELL', price: 0.1 }
    const requests = {
      openPosition: resolve({ inserted: 1 }),
      closePosition: resolve({ updated: 1 }),
      getSymbolsEnabled: resolve({ values: [ 'ETHBTC', 'MCOBTC' ] }),
      setAccountSymbols: resolve({ updated: 1 }),
      getAccount: resolve({
        name: 'test',
        activeSymbols: [ 'NEOBTC' ],
        preferences: {
          chunksNumber: 8,
          profitMin: 0.015,
          stopLimitPerc: 0.01
        }
      }),
      getOpenedPositions: resolve([
        {
          id: 0,
          account: 'test',
          symbol: 'ETHBTC',
          closed: false,
          open: {
            id: 10,
            orderId: 100,
            origQty: 4.9999,
            quantity: 0,
            price: 0.09,
            time: new Date(1515543340213),
            comission: 0.00011,
            comissionAsset: 'ETH'
          }
        }, {
          id: 1,
          account: 'test',
          symbol: 'NEOBTC',
          closed: false,
          open: {
            id: 11,
            orderId: 111,
            origQty: 1,
            quantity: 2,
            price: 0.05,
            time: new Date(1515543340214),
            comission: 0.00012,
            comissionAsset: 'NEO'
          }
        }
      ]),
      getSymbolInfo: resolve({
        symbol: 'ETHBTC',
        status: 'TRADING',
        baseAsset: 'ETH',
        baseAssetPrecision: 8,
        quoteAsset: 'BTC',
        quotePrecision: 8,
        icebergAllowed: true,
        filters: [
          {
            filterType: 'PRICE_FILTER',
             minPrice: '0.00000001',
             maxPrice: '100000.00000000',
             tickSize: '0.00000001'
          },
          {
            filterType: 'LOT_SIZE',
             minQty: '0.00100000',
             maxQty: '90000000.00000000',
             stepSize: '0.00100000'
          },
          {
            filterType: 'MIN_NOTIONAL',
            minNotional: '0.00200000'
          }
        ]
      }),
      accountInfo: resolve({
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' },
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '5.00000000', locked: '0.00000000' }
        ]
      }),
      sendOrder: resolve({
        symbol: 'ETHBTC',
        orderId: 9470272,
        transactTime: 1515590965088,
        price: '0.00000000',
        origQty: '4.9999',
        executedQty: '4.9999',
        side: 'SELL'
      }),
      myTrades: resolve([
        {
          id: 4414702,
          orderId: 9470272,
          price: '0.1',
          qty: '4.9999',
          commission: '0.00000008',
          commissionAsset: 'ETH',
          time: 1515590965088,
          isBuyer: false,
          isMaker: false,
          isBestMatch: true
        }, {
          id: 4415571,
          orderId: 9471743,
          price: '0.002',
          qty: '1.00000000',
          commission: '0.00000008',
          commissionAsset: 'ETH',
          time: 1515591307099,
          isBuyer: false,
          isMaker: false,
          isBestMatch: true
        }
      ])
    }

    await main(account, requests)(signal)

    expect(requests.getSymbolInfo).toHaveBeenCalledTimes(1)
    expect(requests.getSymbolInfo).toHaveBeenCalledWith('ETHBTC')
    expect(requests.getOpenedPositions).toHaveBeenCalledTimes(1)
    expect(requests.getOpenedPositions).toHaveBeenCalledWith(null)
    expect(requests.getAccount).toHaveBeenCalledTimes(1)
    expect(requests.getAccount).toHaveBeenCalledWith(null)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledWith(null)

    expect(requests.sendOrder).toHaveBeenCalledTimes(1)
    expect(requests.sendOrder).toHaveBeenCalledWith({
      quantity: 4.9999,
      side: 'SELL',
      symbol: 'ETHBTC',
      type: 'MARKET'
    })

    expect(requests.myTrades).toHaveBeenCalledTimes(1)
    expect(requests.myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'ETHBTC' })

    expect(requests.closePosition).toHaveBeenCalledTimes(1)
    expect(requests.closePosition).toHaveBeenCalledWith({
      id: 0,
      closed: true,
      profitAmount: 0.04994900099999999,
      profitPerc: 1.1111111111111112,
      close: {
        id: 4414702,
        orderId: 9470272,
        origQty: 4.9999,
        price: 0.1,
        qty: 4.9999,
        time: new Date('2018-01-10T13:29:25.088Z'),
        commission: 0.00000008,
        commissionAsset: 'ETH'
      }
    })

    expect(requests.setAccountSymbols).toHaveBeenCalledTimes(1)
    expect(requests.setAccountSymbols).toHaveBeenCalledWith([ 'NEOBTC', 'ETHBTC' ])
  })
  test('should NOT send SELL order when no psition to cover', async () => {
    const account = 'test'
    const signal = { symbol: 'ETHBTC', side: 'SELL', price: 0.091 }
    const requests = {
      openPosition: resolve({ inserted: 1 }),
      closePosition: resolve({ updated: 1 }),
      getSymbolsEnabled: resolve({ values: [ 'ETHBTC', 'MCOBTC' ] }),
      setAccountSymbols: resolve({ updated: 1 }),
      getAccount: resolve({
        name: 'test',
        activeSymbols: [ 'NEOBTC' ],
        preferences: {
          chunksNumber: 8,
          profitMin: 0.015,
          stopLimitPerc: 0.01
        }
      }),
      getOpenedPositions: resolve([
        {
          id: 0,
          account: 'test',
          symbol: 'ETHBTC',
          closed: false,
          open: {
            id: 10,
            orderId: 100,
            origQty: 4.9999,
            quantity: 0,
            price: 0.09,
            time: new Date(1515543340213),
            comission: 0.00011,
            comissionAsset: 'ETH'
          }
        }
      ]),
      getSymbolInfo: resolve({
        symbol: 'ETHBTC',
        status: 'TRADING',
        baseAsset: 'ETH',
        baseAssetPrecision: 8,
        quoteAsset: 'BTC',
        quotePrecision: 8,
        icebergAllowed: true,
        filters: [
          {
            filterType: 'PRICE_FILTER',
             minPrice: '0.00000001',
             maxPrice: '100000.00000000',
             tickSize: '0.00000001'
          },
          {
            filterType: 'LOT_SIZE',
             minQty: '0.00100000',
             maxQty: '90000000.00000000',
             stepSize: '0.00100000'
          },
          {
            filterType: 'MIN_NOTIONAL',
            minNotional: '0.00200000'
          }
        ]
      }),
      accountInfo: resolve({
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' },
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '5.00000000', locked: '0.00000000' }
        ]
      }),
      sendOrder: resolve({}),
      myTrades: resolve([])
    }

    await main(account, requests)(signal)

    expect(requests.getSymbolInfo).toHaveBeenCalledTimes(1)
    expect(requests.getSymbolInfo).toHaveBeenCalledWith('ETHBTC')
    expect(requests.getOpenedPositions).toHaveBeenCalledTimes(1)
    expect(requests.getOpenedPositions).toHaveBeenCalledWith(null)
    expect(requests.getAccount).toHaveBeenCalledTimes(1)
    expect(requests.getAccount).toHaveBeenCalledWith(null)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledWith(null)

    expect(requests.sendOrder).toHaveBeenCalledTimes(0)
    expect(requests.closePosition).toHaveBeenCalledTimes(0)
    expect(requests.openPosition).toHaveBeenCalledTimes(0)
    expect(requests.setAccountSymbols).toHaveBeenCalledTimes(0)
  })
})
