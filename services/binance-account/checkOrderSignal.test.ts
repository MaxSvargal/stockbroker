import main from './checkOrderSignal'

const tick = () => Promise.resolve()
const resolveJson = (data: any) => Promise.resolve(JSON.stringify(data))
const resolveJsonList = (data: any) => Promise.resolve(data.map(JSON.stringify))
const resolve = (data: any) => Promise.resolve(data)
const mockOncePromiseJson = (data: any) => jest.fn().mockReturnValueOnce(resolveJson(data))
const mockOncePromiseJsonList = (data: any) => jest.fn().mockReturnValueOnce(resolveJsonList(data))
const mockOncePromise = (data: any) => jest.fn().mockReturnValueOnce(resolve(data))

const makeRequests = ({
  getEnabledToBuySymbols, getAccountActiveSymbols, setAccountActiveSymbols,
  getExchangeInfoOfSymbol, getPositions, accountInfo, sendOrder, myTrades,
  setPosition
}) => ({
  getEnabledToBuySymbols: mockOncePromiseJson(getEnabledToBuySymbols),
  getPositions: mockOncePromiseJsonList(getPositions),
  getExchangeInfoOfSymbol: mockOncePromiseJson(getExchangeInfoOfSymbol),
  accountInfo: mockOncePromise(accountInfo),
  sendOrder: mockOncePromise(sendOrder),
  myTrades: mockOncePromise(myTrades),
  setPosition: mockOncePromiseJson(setPosition),
  getAccountActiveSymbols: mockOncePromiseJson(getAccountActiveSymbols),
  setAccountActiveSymbols: mockOncePromiseJson(setAccountActiveSymbols),
})

describe('Exchange Account: Check Order Signal', () => {
  test('should send BUY order and store position correctly', async () => {
    const account = 'test'
    const signal = { symbol: 'ETHBTC', type: 'BUY', price: 0.002 }
    const requests = makeRequests({
      setPosition: 'OK',
      getEnabledToBuySymbols: [ 'ETHBTC', 'MCOBTC' ],
      getAccountActiveSymbols: null,
      setAccountActiveSymbols: 'OK',
      getExchangeInfoOfSymbol: {
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
      },
      accountInfo: {
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' }
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '1.00000000', locked: '0.00000000' }
        ]
      },
      getPositions: [
        {
          id: 0,
          orderId: 1,
          created: 1515543340213,
          symbol: 'ETHBTC',
          side: 'BUY',
          price: '1.1',
          executedQty: 1
        }, {
          id: 1,
          orderId: 2,
          created: 1515544540654,
          symbol: 'ETHBTC',
          side: 'SELL',
          price: '1.2',
          executedQty: 1,
          coveredIds: [ 0 ]
        }, {
          id: 2,
          orderId: 3,
          created: 1515544540656,
          symbol: 'ETHBTC',
          side: 'BUY',
          price: '1.2',
          executedQty: '0.05'
        }
      ],
      sendOrder: {
        symbol: 'ETHBTC',
        orderId: 9470272,
        transactTime: 1515590965088,
        price: '0.00000000',
        origQty: '1.00000000',
        executedQty: '1.00000000',
        side: 'BUY'
      },
      myTrades: [
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
      ]
    })
    main(account, requests)(signal)

    await tick()

    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledTimes(1)
    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledWith(null)
    expect(requests.getPositions).toHaveBeenCalledTimes(1)
    expect(requests.getPositions).toHaveBeenCalledWith(null)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.sendOrder).toHaveBeenCalledTimes(1)
    expect(requests.sendOrder).toHaveBeenCalledWith({
      quantity: 0.015,
      side: 'BUY',
      symbol: 'ETHBTC',
      type: 'MARKET'
    })

    await tick()

    expect(requests.myTrades).toHaveBeenCalledTimes(1)
    expect(requests.myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'ETHBTC' })

    await tick()

    expect(requests.setPosition).toHaveBeenCalledTimes(1)
    expect(requests.setPosition).toHaveBeenCalledWith({
      symbol: 'ETHBTC',
      orderId: 9470272,
      transactTime: 1515590965088,
      price: '0.002',
      origQty: '1.00000000',
      executedQty: '1.00000000',
      side: 'BUY',
      id: 4414702,
      qty: '1.00000000',
      commission: '0.00000008',
      commissionAsset: 'ETH',
      time: 1515590965088,
      isBuyer: false,
      isMaker: false,
      isBestMatch: true,
      comissionIncQty: 0.99999992,
      profit: null,
      coveredIds: null
    })

    await tick()

    expect(requests.getAccountActiveSymbols).toHaveBeenCalledTimes(1)
    expect(requests.getAccountActiveSymbols).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.setAccountActiveSymbols).toHaveBeenCalledTimes(1)
    expect(requests.setAccountActiveSymbols).toHaveBeenCalledWith('[\"ETHBTC\"]')
  })
  test('should NOT send BUY order when symbols is not enabled', async () => {
    const account = 'test'
    const signal = { symbol: 'NEOBTC', type: 'BUY', price: 0.002 }
    const requests = makeRequests({
      getEnabledToBuySymbols: [ 'ETHBTC', 'MCOBTC' ],
      getExchangeInfoOfSymbol: {},
      getPositions: []
    })
    main(account, requests)(signal)

    await tick()

    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledTimes(1)
    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.getPositions).toHaveBeenCalledTimes(0)
    expect(requests.accountInfo).toHaveBeenCalledTimes(0)

    await tick()

    expect(requests.sendOrder).toHaveBeenCalledTimes(0)
    expect(requests.setPosition).toHaveBeenCalledTimes(0)
    expect(requests.getAccountActiveSymbols).toHaveBeenCalledTimes(0)
    expect(requests.setAccountActiveSymbols).toHaveBeenCalledTimes(0)
  })
  test('should send SELL order and store position correctly', async () => {
    const account = 'test'
    const signal = { symbol: 'ETHBTC', type: 'SELL', price: 0.0024243 }
    const requests = makeRequests({
      setPosition: 'OK',
      getEnabledToBuySymbols: [ 'ETHBTC', 'MCOBTC' ],
      getAccountActiveSymbols: [ 'ETHBTC', 'NEOBTC' ],
      setAccountActiveSymbols: 'OK',
      getExchangeInfoOfSymbol: {
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
      },
      accountInfo: {
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' }
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '6.00000000', locked: '0.00000000' }
        ]
      },
      getPositions: [
        {
          id: 0,
          orderId: 1,
          created: 1515543340213,
          symbol: 'ETHBTC',
          side: 'BUY',
          price: '1.1',
          executedQty: 1
        }, {
          id: 1,
          orderId: 2,
          created: 1515544540654,
          symbol: 'ETHBTC',
          side: 'SELL',
          price: '1.2',
          executedQty: 1,
          coveredIds: [ 0 ]
        }, {
          id: 2,
          orderId: 3,
          created: 1515544540656,
          symbol: 'ETHBTC',
          side: 'BUY',
          price: '0.0023999',
          executedQty: '5.58',
          comissionIncQty: 5.57442
        }
      ],
      sendOrder: {
        symbol: 'ETHBTC',
        orderId: 9470272,
        transactTime: 1515590965088,
        price: '0.00000000',
        origQty: '5.58',
        executedQty: '5.58',
        side: 'SELL'
      },
      myTrades: [
        {
          id: 4414702,
          orderId: 9470272,
          price: '0.0024143',
          qty: '5.58',
          commission: '0.00001347',
          commissionAsset: 'BTC',
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
      ]
    })
    main(account, requests)(signal)

    await tick()

    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledTimes(1)
    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledWith(null)
    expect(requests.getPositions).toHaveBeenCalledTimes(1)
    expect(requests.getPositions).toHaveBeenCalledWith(null)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.sendOrder).toHaveBeenCalledTimes(1)
    expect(requests.sendOrder).toHaveBeenCalledWith({
      quantity: 5.574,
      side: 'SELL',
      symbol: 'ETHBTC',
      type: 'MARKET'
    })

    await tick()

    expect(requests.myTrades).toHaveBeenCalledTimes(1)
    expect(requests.myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'ETHBTC' })

    await tick()

    expect(requests.setPosition).toHaveBeenCalledTimes(1)
    expect(requests.setPosition).toHaveBeenCalledWith({
      symbol: 'ETHBTC',
      orderId: 9470272,
      transactTime: 1515590965088,
      price: '0.0024143',
      origQty: '5.58',
      executedQty: '5.58',
      side: 'SELL',
      id: 4414702,
      qty: '5.58',
      commission: '0.00001347',
      commissionAsset: 'BTC',
      time: 1515590965088,
      isBuyer: false,
      isMaker: false,
      isBestMatch: true,
      comissionIncQty: 5.574420743072526,
      profit: 0.5000250010417006,
      coveredIds: [ 2 ]
    })

    await tick()

    expect(requests.getAccountActiveSymbols).toHaveBeenCalledTimes(1)
    expect(requests.getAccountActiveSymbols).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.setAccountActiveSymbols).toHaveBeenCalledTimes(1)
    expect(requests.setAccountActiveSymbols).toHaveBeenCalledWith('[\"NEOBTC\"]')
  })
  test('should NOT send SELL order when no psition to cover', async () => {
    const account = 'test'
    const signal = { symbol: 'ETHBTC', type: 'SELL', price: 0.002 }
    const requests = makeRequests({
      setPosition: 'OK',
      getEnabledToBuySymbols: [ 'ETHBTC', 'MCOBTC' ],
      getAccountActiveSymbols: null,
      setAccountActiveSymbols: 'OK',
      getExchangeInfoOfSymbol: {
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
      },
      accountInfo: {
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' }
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '5.00000000', locked: '0.00000000' }
        ]
      },
      getPositions: [
        {
          id: 0,
          orderId: 1,
          created: 1515543340213,
          symbol: 'ETHBTC',
          side: 'BUY',
          price: '1.1',
          executedQty: 1
        }, {
          id: 1,
          orderId: 2,
          created: 1515544540654,
          symbol: 'ETHBTC',
          side: 'SELL',
          price: '1.2',
          executedQty: 1,
          coveredIds: [ 0 ]
        }, {
          id: 2,
          orderId: 3,
          created: 1515544540656,
          symbol: 'ETHBTC',
          side: 'BUY',
          price: '0.002',
          executedQty: '5.58',
          comissionIncQty: 5.57442
        }
      ]
    })
    main(account, requests)(signal)

    await tick()

    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledTimes(1)
    expect(requests.getEnabledToBuySymbols).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.getPositions).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)

    await tick()

    expect(requests.sendOrder).toHaveBeenCalledTimes(0)
    expect(requests.setPosition).toHaveBeenCalledTimes(0)
    expect(requests.getAccountActiveSymbols).toHaveBeenCalledTimes(0)
    expect(requests.setAccountActiveSymbols).toHaveBeenCalledTimes(0)
  })
})
