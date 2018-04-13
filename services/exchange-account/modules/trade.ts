import { or, prop, equals, unapply, converge, find, o, propEq, head, last, when, isNil, not, and, ifElse, always, path } from 'ramda'
import { makeOpenedPosition, makeClosedPosition, Order, Trade, Position } from './positions'

const { MODE } = process.env

type FindTradeByOrderId = (a: number, b: Trade[]) => Trade
const findTradeByOrderId: FindTradeByOrderId = unapply(converge(find, [ o(propEq('orderId'), head), last ]))

const getSymbol = prop('symbol')
const getAccount = prop('account')
const getSide = ifElse(isNil, always('BUY'), always('SELL'))
const getQuantity = <any>ifElse(o(equals('BUY'), head), o(<any>prop('quantity'), last), o(path([ 'open', 'origQty' ]), last))

type Props = {
  sendOrder: (a: { side: string, symbol: string, quantity: number, type: 'MARKET' }) => Order,
  myTrades: (a: { symbol: string, limit: number }) => Trade[],
  openPosition?: (a: {}) => {},
  closePosition?: (a: {}) => {},
  position?: { symbol: string, quantity: number, account: string}
  positionToCover?: Position,
  price?: number
}

export default async ({ openPosition, closePosition, sendOrder, myTrades, positionToCover, position, price }: Props): Promise<{} | void> => {
  const account: string = getAccount(position)
  const side: string = getSide(positionToCover)
  const symbol: string = getSymbol(or(position, positionToCover))
  const quantity: number = getQuantity([ side, or(position, positionToCover) ])

  // const order = {}
  // const trade = {
  //   symbol: position ? position.symbol : positionToCover.symbol,
  //   price,
  //   id: null,
  //   qty: 1,
  //   origQty: 1,
  //   commission: 0.0015,
  //   commissionAsset: 'TEST',
  //   orderId: 0,
  //   time: new Date().getTime()
  // }
  const order = await sendOrder({ side, symbol, quantity, type: 'MARKET' })
  const trades = await myTrades({ symbol, limit: 10 })
  const trade = findTradeByOrderId(prop('orderId', order), trades)

  return equals('BUY', side) ?
    openPosition && await openPosition(makeOpenedPosition([ order, trade, { account } ])) :
    closePosition && await closePosition(makeClosedPosition([ positionToCover, order, trade ]))
}
