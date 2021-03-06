import { log, error } from '../../utils/log'
import { or, prop, equals, unapply, converge, find, o, propEq, head, last, when, isNil, not, and, ifElse, always, path } from 'ramda'
import { makeOpenedPosition, makeClosedPosition, Order, Trade, Position } from './positions'

const { MODE } = process.env

type FindTradeByOrderId = (a: number, b: Trade[]) => Trade
const findTradeByOrderId: FindTradeByOrderId = unapply(converge(find, [ o(propEq('orderId'), head), last ]))

const getSymbol = prop('symbol')
const getAccount = prop('account')
const getSide = ifElse(isNil, always('BUY'), always('SELL'))
const getQuantity = <any>ifElse(o(equals('BUY'), head), o(<any>prop('quantity'), last), o(path([ 'open', 'origQty' ]), last))
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
  const account: string = getAccount(or(position, positionToCover))
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

  const getTrade = async (): Promise<any> => {
    const trades = await myTrades({ symbol, limit: 10 })
    const trade = findTradeByOrderId(prop('orderId', order), trades)
    log({ account, side, order, trade })

    if (!trade) {
      error(`Trade of ${symbol} orderId ${prop('orderId', order)} doesn't found. Trades: %O`, trades)
      return await delay(2000).then(getTrade)
    } else {
      return trade
    }
  }

  const trade = await getTrade()

  return equals('BUY', side) ?
    openPosition && await openPosition(makeOpenedPosition([ order, trade, { account } ])) :
    closePosition && await closePosition(makeClosedPosition([ positionToCover, order, trade ]))
}
