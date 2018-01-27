import checkExitFromSymbols from './checkExitFromSymbols'

const tick = () => Promise.resolve()
const resolveJson = (data: any) => Promise.resolve(JSON.stringify(data))
const resolveJsonList = (data: any) => Promise.resolve(data.map(JSON.stringify))
const resolve = (data: any) => Promise.resolve(data)
const mockOncePromiseJson = (data: any) => jest.fn().mockReturnValueOnce(resolveJson(data))
const mockOncePromiseJsonList = (data: any) => jest.fn().mockReturnValueOnce(resolveJsonList(data))
const mockOncePromise = (data: any) => jest.fn().mockReturnValueOnce(resolve(data))
const mockPromise = (data: any) => jest.fn().mockReturnValue(resolve(data))
const mockPromises = (data: any) => jest.fn()
  .mockReturnValueOnce(resolve(data[0]))
  .mockReturnValueOnce(resolve(data[1]))
  .mockReturnValueOnce(resolve(data[2]))
const mockPromisesJson = (data: any) => jest.fn()
  .mockReturnValueOnce(resolveJson(data[0]))
  .mockReturnValueOnce(resolveJson(data[1]))
  .mockReturnValueOnce(resolveJson(data[2]))

const makeRequests = ({
  getEnabledToBuySymbols, getAccountActiveSymbols, setAccountActiveSymbols,
  getExchangeInfoOfSymbol, getPositions, accountInfo, sendOrder, myTrades,
  setPosition
}) => ({
  getEnabledToBuySymbols: mockOncePromiseJson(getEnabledToBuySymbols),
  getPositions: mockOncePromiseJsonList(getPositions),
  getExchangeInfoOfSymbol: mockPromisesJson(getExchangeInfoOfSymbol),
  accountInfo: mockOncePromise(accountInfo),
  sendOrder: mockPromises(sendOrder),
  myTrades: mockPromise(myTrades),
  setPosition: mockOncePromiseJson(setPosition),
  getAccountActiveSymbols: mockOncePromiseJson(getAccountActiveSymbols),
  setAccountActiveSymbols: mockOncePromiseJson(setAccountActiveSymbols),
})

describe('Exchange Account Check Exit From Symbols', () => {
  test('should sell all opened chunks of symbols from event', async () => {
    const event = [ 'NEOBTC', 'ETHBTC', 'EOSBTC' ]

    const requests = makeRequests({
      setPosition: 'OK',
      getEnabledToBuySymbols: [ 'ETHBTC', 'MCOBTC' ],
      getAccountActiveSymbols: null,
      setAccountActiveSymbols: 'OK',
      getExchangeInfoOfSymbol: [
        {
          symbol: 'NEOBTC',
          filters: [
            {
              filterType: 'LOT_SIZE',
               minQty: '0.00100000',
               maxQty: '90000000.00000000',
               stepSize: '0.00100000'
            }
          ]
        },
        {
          symbol: 'EOSBTC',
          filters: [
            {
              filterType: 'LOT_SIZE',
               minQty: '0.00100000',
               maxQty: '90000000.00000000',
               stepSize: '0.00100000'
            }
          ]
        }
      ],
      accountInfo: {
        balances: [
          { asset: 'BTC', free: '0.11000000', locked: '0.00000000' },
          { asset: 'NEO', free: '20.00000000', locked: '0.00000000' },
          { asset: 'EOS', free: '11.00000000', locked: '0.00000000' },
          { asset: 'ETH', free: '1.00000000', locked: '0.00000000' }
        ]
      },
      getPositions: [
        {
          id: 1000000,
          symbol: 'EOSBTC',
          price: '0.00245000',
          executedQty: '1.11000001',
          side: 'BUY'
        }, {
          id: 1000001,
          symbol: 'NEOBTC',
          price: '0.00246000',
          executedQty: '1.21000001',
          side: 'BUY'
        }, {
          id: 1000002,
          symbol: 'NEOBTC',
          price: '0.00247000',
          executedQty: '1.31000001',
          side: 'BUY'
        }, {
          id: 1000003,
          symbol: 'EOSBTC',
          price: '0.00248000',
          executedQty: '1.41000001',
          side: 'BUY'
        }, {
        }, {
          id: 1000004,
          symbol: 'EOSBTC',
          price: '0.00249000',
          executedQty: '1.51000001',
          side: 'BUY'
        }, {
          id: 1000005,
          symbol: 'EOSBTC',
          price: '0.00248000',
          executedQty: '1.61000001',
          side: 'SELL',
          coveredIds: [ 1000000 ]
        }, {
          id: 1000006,
          symbol: 'EOSBTC',
          price: '0.00248000',
          executedQty: '1.71000001',
          side: 'SELL',
          coveredIds: [ 1000003 ]
        }
      ],
      sendOrder: [
        { orderId: 2001, symbol: 'NEOBTC' },
        { orderId: 2003, symbol: 'EOSBTC' }
      ],
      myTrades: [
        { orderId: 2003, time: 1515590960001, qty: '1.51000001', price: '0.00248000' },
        { orderId: 2002, time: 1515590965088, qty: '0', price: '0' },
        { orderId: 2001, time: 1515590960000, qty: '2.52000002', price: '0.00245000' },
      ]
    })

    checkExitFromSymbols(requests)(event)

    expect(requests.getPositions).toHaveBeenCalledTimes(1)
    expect(requests.getPositions).toHaveBeenCalledWith(null)
    expect(requests.accountInfo).toHaveBeenCalledTimes(1)
    expect(requests.accountInfo).toHaveBeenCalledWith(null)

    await tick()

    expect(requests.getExchangeInfoOfSymbol).toHaveBeenCalledTimes(2)
    expect(requests.getExchangeInfoOfSymbol).toHaveBeenCalledWith('NEOBTC')
    expect(requests.getExchangeInfoOfSymbol).toHaveBeenCalledWith('EOSBTC')

    await tick()

    expect(requests.sendOrder).toHaveBeenCalledTimes(2)
    expect(requests.sendOrder).toHaveBeenCalledWith({
      symbol: 'NEOBTC', quantity: 20, side: 'SELL', type: 'MARKET'
    })
    expect(requests.sendOrder).toHaveBeenCalledWith({
      symbol: 'EOSBTC', quantity: 11, side: 'SELL', type: 'MARKET'
    })

    await tick()

    expect(requests.myTrades).toHaveBeenCalledTimes(2)
    expect(requests.myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'NEOBTC' })
    expect(requests.myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'EOSBTC' })

    await tick()

    expect(requests.setPosition).toHaveBeenCalledTimes(2)
    expect(requests.setPosition).toHaveBeenCalledWith({
      symbol: 'NEOBTC',
      orderId: 2001,
      time: 1515590960000,
      qty: '2.52000002',
      price: '0.00245000',
      profit: -0.4890399542692036,
      coveredIds: [ 1000001, 1000002 ]
    })
    expect(requests.setPosition).toHaveBeenCalledWith({
      symbol: 'EOSBTC',
      orderId: 2003,
      time: 1515590960001,
      qty: '1.51000001',
      price: '0.00248000',
      profit: -0.24759104636032422,
      coveredIds: [ 1000004 ]
    })
  })
})
