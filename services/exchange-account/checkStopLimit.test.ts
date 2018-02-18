import checkStopLimit from './checkStopLimit'


describe('Exchange Account Check Stop Limit', () => {
  test('should work correctly', async () => {
    const data = {
      positions: [
        {
          id: 0,
          symbol: 'NEOBTC',
          volatilityPerc: 0.005,
          closed: false,
          open: {
            price: 0.06,
            origQty: 1
          }
        },
        {
          id: 1,
          symbol: 'NEOBTC',
          volatilityPerc: 0.006,
          closed: false,
          open: {
            price: 0.06,
            origQty: 1
          }
        },
        {
          id: 2,
          symbol: 'MCOBTC',
          riftPrice: 0.007,
          closed: false,
          open: {
            price: 0.07,
            origQty: 1
          }
        }
      ],
      prices: {
        NEOBTC: '0.04974',
        MCOBTC: '0.017464'
      },
      order: {
        symbol: 'NEOBTC',
        orderId: 4414702,
        transactTime: 1515590965088,
        price: '0.00000000',
        origQty: '1.00000000',
        executedQty: '1.00000000',
        side: 'SELL'
      },
      trades: [
        {
          id: 4415570,
          orderId: 4414702,
          price: '0.053871',
          qty: '1.00000000',
          commission: '0.00000008',
          commissionAsset: 'BTC'
        }, {
          id: 4415571,
          orderId: 9471743
        }
      ]
    }

    const requests = {
      getOpenedPositions: jest.fn().mockReturnValue(Promise.resolve(data.positions)),
      getPrices: jest.fn().mockReturnValue(Promise.resolve(data.prices)),
      closePosition: jest.fn().mockReturnValue(Promise.resolve({ updated: 1 })),
      sendOrder: jest.fn().mockReturnValue(Promise.resolve(data.order)),
      myTrades: jest.fn().mockReturnValue(Promise.resolve(data.trades))
    }

    await checkStopLimit(requests)()

    expect(requests.getOpenedPositions).toHaveBeenCalledTimes(1)
    expect(requests.getOpenedPositions).toHaveBeenCalledWith(null)

    expect(requests.getPrices).toHaveBeenCalledTimes(1)
    expect(requests.getPrices).toHaveBeenCalledWith(null)

    expect(requests.sendOrder).toHaveBeenCalledTimes(2)
    expect(requests.sendOrder).toHaveBeenCalledWith({ side: 'SELL', symbol: 'NEOBTC', type: 'MARKET', quantity: 1 })
    await Promise.resolve()
    expect(requests.myTrades).toHaveBeenCalledTimes(2)
    await Promise.resolve()
    expect(requests.closePosition).toHaveBeenCalledTimes(2)
    expect(requests.closePosition).toHaveBeenCalledWith({
      id: 0,
      closed: true,
      profitAmount: -0.006122870999999995,
      profitPerc: -11.37717881606058,
      close: {
        id: 4415570,
        orderId: 4414702,
        origQty: 1,
        price: 0.053871,
        qty: 1,
        commission: 8e-8,
        commissionAsset: 'BTC'
      }
    })

  })
})
