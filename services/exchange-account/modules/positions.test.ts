import { makeOpenedPosition, makeClosedPosition, findPositionToCover } from './positions'

describe('Exchange Account Positions', () => {
  test('makeOpenedPosition should work correctly', () => {
    const account = 'test'
    const order = { orderId: 213, origQty: '2.5', side: 'BUY', symbol: 'BTCNEO' }
    const trade = { id: 0, orderId: 213, time: 1517659764364, price: '0.012550', qty: '2.5', commission: '0.0005', commissionAsset: 'NEO' }

    expect(makeOpenedPosition([ order, trade, { account } ])).toEqual({
      account: 'test',
      symbol: 'BTCNEO',
      closed: false,
      open: {
        id: 0,
        orderId: 213,
        qty: 2.5,
        origQty: 2.5,
        price: 0.012550,
        commission: 0.0005,
        commissionAsset: 'NEO',
        time: new Date(1517659764364)
      }
    })
  })

  test('makeClosedPosition should work correctly', () => {
    const position = {
      id: 0,
      account: 'test',
      symbol: 'BTCNEO',
      closed: false,
      open: {
        id: 0,
        orderId: 213,
        qty: 2.5,
        origQty: 2.5,
        price: 0.0143,
        commission: 0.000005,
        commissionAsset: 'NEO',
        time: new Date(1517750114033)
      }
    }
    const order = { orderId: 214, origQty: '2.5', side: 'SELL', symbol: 'BTCNEO' }
    const trade = { id: 1, orderId: 214, time: 1517659764365, price: '0.0145', qty: '2.5', commission: '0.000005', commissionAsset: 'BTC' }

    expect(makeClosedPosition([ position, order, trade ])).toEqual({
      id: 0,
      closed: true,
      profitAmount: 0.0004994999999999999,
      profitPerc: 1.013986013986014,
      close: {
        id: 1,
        orderId: 214,
        qty: 2.5,
        origQty: 2.5,
        price: 0.0145,
        commission: 0.000005,
        commissionAsset: 'BTC',
        time: new Date(1517659764365)
      }
    })
  })

  test('findPositionToCover should work correctly', () => {
    
  })
})
