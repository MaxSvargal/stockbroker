import { log, error as logError } from '../utils/log'
import {
  o, cond, always, unapply, ifElse, equals, reject, complement, converge, last, divide, uniq, map, compose,
  length, subtract, contains, filter, prop, propEq, find, T, gt, isNil, both, append, head, path, lte
} from 'ramda'

import trade from './modules/trade'
import { roundToMinQty, getMinQtyFromSymbolInfo, takePairFromSymbol } from './shared'
import { findPositionToCover, chunkAmountToSellCond, makeOpenedPosition, makeClosedPosition, Order, Trade, Position } from './modules/positions'

const findByAssetProp = o(find, propEq('asset'))
const parseFreeProp = o(parseFloat, prop('free'))
const filterBySymbol = o(filter, propEq('symbol'))

const buyErrorsCondition = cond([
  [ o(equals(0), prop('avaliableChunks')), always(Error('Too much opened positions')) ],
  [ o(equals(0), prop('quantity')), always(Error('No funds avaliable to buy')) ],
  [ compose(lte(1), length, prop('openedPositionsOfSymbol')), always(Error('Position for this symbol is already open')) ],
  [ T, always(null) ]
])
const sellErrorsCondition = cond([
  [ o(isNil, prop('positionToCover')), always(Error('No position to cover')) ],
  [ converge(gt, [ prop('quantity'), prop('avaliableToSell') ]), always(Error('No funds avaliable to cover position')) ],
  [ T, always(null) ]
])

type SignalRequest = { account?: string, symbol: string, side: 'BUY' | 'SELL', price: number, forced: boolean }
const checkSignal = (account: string, requests: any) =>
  async ({ account: signalAccount, symbol, side, price, forced }: SignalRequest) => {
  try {
    if (signalAccount && signalAccount !== account) return null

    const {
      getAccount,
      getOpenedPositions,
      getSymbolInfo,
      openPosition,
      closePosition,
      accountInfo,
      sendOrder,
      myTrades
    } = requests

    const [
      symbolInfo,
      openedPositions,
      { preferences: { chunksNumber = 8, minProfit = 0.006 } },
      { balances }
    ] = await Promise.all([
      getSymbolInfo(symbol),
      getOpenedPositions(null),
      getAccount(null),
      accountInfo(null)
    ])

    const [ slaveCurrency, masterCurrency ] = takePairFromSymbol(symbol)
    const openedPositionsOfSymbol = filterBySymbol(symbol)(openedPositions)
    const minQty = getMinQtyFromSymbolInfo(symbolInfo)

    const execBuy = () => {
      const findByMasterCurrency = findByAssetProp(masterCurrency)
      const avaliableToBuy = o(parseFreeProp, findByMasterCurrency)(balances)
      const avaliableChunks = subtract(chunksNumber, length(openedPositions))
      const chunkAmount = divide(avaliableToBuy, avaliableChunks)
      const quantity: number = roundToMinQty(minQty, divide(chunkAmount, price))
      const error = buyErrorsCondition({ avaliableChunks, quantity, openedPositionsOfSymbol })

      return { quantity, error }
    }

    const execSell = () => {
      const findBySlaveCurrency = findByAssetProp(slaveCurrency)
      const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
      const positionToCover = findPositionToCover(forced ? Infinity : price, minProfit, openedPositionsOfSymbol)
      const chunkAmount = path([ 'open', 'origQty' ], positionToCover)
      const quantity: number = roundToMinQty(minQty, chunkAmountToSellCond([ avaliableToSell, chunkAmount ]))
      const error = sellErrorsCondition({ positionToCover, quantity, avaliableToSell })

      return { quantity, error, positionToCover }
    }

    const getTradeSide = ifElse(equals('BUY'), execBuy, execSell)
    const { quantity, error, positionToCover } = getTradeSide(side)
    if (error) throw error

    return equals('BUY', side) ?
      await trade({ sendOrder, myTrades, openPosition, position: { account, symbol, quantity } }) :
      await trade({ sendOrder, myTrades, closePosition, positionToCover })

  } catch (err) {
    const errorEvent = {
      type: 'orderExecutionError',
      error: err.message || err,
      side,
      account,
      symbol,
      price
    }
    logError(errorEvent)
  }
}

export default checkSignal
