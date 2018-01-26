import checkExitFromSymbols from './checkExitFromSymbols'

const tick = () => Promise.resolve()

describe('Exchange Account Check Exit From Symbols', () => {
  test('should sell all opened chunks of symbols from event', async () => {
    const event = [ 'NEOBTC', 'ETHBTC', 'EOSBTC' ]
    const positions = [
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
    ]
    const orderNEOBTC = { orderId: 2001, symbol: 'NEOBTC' }
    const orderEOSBTC = { orderId: 2003, symbol: 'EOSBTC' }
    const trades = [
      { orderId: 2003, time: 1515590960001, qty: '1.51000001', price: '0.00248000' },
      { orderId: 2002, time: 1515590965088, qty: '0', price: '0' },
      { orderId: 2001, time: 1515590960000, qty: '2.52000002', price: '0.00245000' },
    ]
    const position = 'OK'
    const getPositions = jest.fn().mockReturnValueOnce(Promise.resolve(positions))
    const sendOrder = jest.fn()
      .mockReturnValueOnce(Promise.resolve(orderNEOBTC))
      .mockReturnValueOnce(Promise.resolve(orderEOSBTC))
    const myTrades = jest.fn().mockReturnValue(Promise.resolve(trades))
    const setPosition = jest.fn().mockReturnValueOnce(Promise.resolve(position))

    checkExitFromSymbols({ getPositions, sendOrder, myTrades, setPosition })(event)

    expect(getPositions).toHaveBeenCalledTimes(1)
    expect(getPositions).toHaveBeenCalledWith(null)

    await tick()

    expect(sendOrder).toHaveBeenCalledTimes(2)
    expect(sendOrder).toHaveBeenCalledWith({
      symbol: 'NEOBTC', quantity: '2.52000002', side: 'SELL', type: 'MARKET'
    })
    expect(sendOrder).toHaveBeenCalledWith({
      symbol: 'EOSBTC', quantity: '1.51000001', side: 'SELL', type: 'MARKET'
    })

    await tick()

    expect(myTrades).toHaveBeenCalledTimes(2)
    expect(myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'NEOBTC' })
    expect(myTrades).toHaveBeenCalledWith({ limit: 10, symbol: 'EOSBTC' })

    await tick()

    expect(setPosition).toHaveBeenCalledTimes(2)
    expect(setPosition).toHaveBeenCalledWith({
      symbol: 'NEOBTC',
      orderId: 2001,
      time: 1515590960000,
      qty: '2.52000002',
      price: '0.00245000',
      profit: -0.4890399542692036,
      coveredIds: [ 1000001, 1000002 ]
    })
    expect(setPosition).toHaveBeenCalledWith({
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
