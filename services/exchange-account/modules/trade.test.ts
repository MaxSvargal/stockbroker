import trade from './trade'

describe('Exchange Account Trade', () => {
  test('should buy work correctly', async () => {
    const props = {
      openPosition: jest.fn().mockReturnValueOnce(Promise.resolve({ inserted: 1 })),
      sendOrder: jest.fn().mockReturnValueOnce(Promise.resolve({ orderId: 0 })),
      myTrades: jest.fn().mockReturnValueOnce(Promise.resolve([ { orderId: 0, price: 0.1, origQty: 0.5, symbol: 'BTCUSDT' } ])),
      position: { symbol: 'BTCUSDT', quantity: 0.5, side: 'BUY', account: 'maxsvargal' }
    }
    const resp = await trade(props)

    expect(props.sendOrder).toHaveBeenCalledTimes(1)
    expect(props.sendOrder).toHaveBeenCalledWith({ side: 'BUY', type: 'MARKET', symbol: 'BTCUSDT', quantity: 0.5 })

    expect(props.myTrades).toHaveBeenCalledTimes(1)
    expect(props.myTrades).toHaveBeenCalledWith({ symbol: 'BTCUSDT', limit: 10 })

    expect(props.openPosition).toHaveBeenCalledTimes(1)
    expect(props.openPosition).toHaveBeenCalledWith({ account: 'maxsvargal', symbol: 'BTCUSDT', closed: false, open: { orderId: 0, origQty: 0.5, price: 0.1 } })

    expect(resp).toEqual({ inserted: 1 })
  })

  test('should sell work correctly', async () => {
    const props = {
      closePosition: jest.fn().mockReturnValueOnce(Promise.resolve({ updated: 1 })),
      sendOrder: jest.fn().mockReturnValueOnce(Promise.resolve({ orderId: 0 })),
      myTrades: jest.fn().mockReturnValueOnce(Promise.resolve([ { orderId: 0, price: 0.2, origQty: 0.5 } ])),
      positionToCover: { account: 'maxsvargal', symbol: 'BTCUSDT', closed: false, open: { orderId: 0, origQty: 0.5, price: 0.1 } }
    }
    const resp = await trade(props)

    expect(props.sendOrder).toHaveBeenCalledTimes(1)
    expect(props.sendOrder).toHaveBeenCalledWith({ side: 'SELL', type: 'MARKET', symbol: 'BTCUSDT', quantity: 0.5 })

    expect(props.myTrades).toHaveBeenCalledTimes(1)
    expect(props.myTrades).toHaveBeenCalledWith({ symbol: 'BTCUSDT', limit: 10 })

    expect(props.closePosition).toHaveBeenCalledTimes(1)
    expect(props.closePosition).toHaveBeenCalledWith({ closed: true, profitAmount: 0.04995, profitPerc: 2, close: { orderId: 0, origQty: 0.5, price: 0.2 } })

    expect(resp).toEqual({ updated: 1 })
  })
})
