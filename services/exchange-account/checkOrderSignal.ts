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
  // [ converge(gt, [ prop('quantity'), prop('avaliableToSell') ]), always(Error('No funds avaliable to cover position')) ],
  [ T, always(null) ]
])

type SignalRequest = { symbol: string, side: 'BUY' | 'SELL', price: number, forced: boolean }
const checkSignal = (account: string, requests: any) =>
  async ({ symbol, side, price, forced }: SignalRequest) => {
  try {
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

    let [
      symbolInfo,
      openedPositions,
      { preferences: { chunksNumber = 8 } },
      { balances }
    ] = await Promise.all([
      getSymbolInfo(symbol),
      getOpenedPositions(null),
      getAccount(null),
      accountInfo(null)
    ])

    balances = [
      { asset: 'BTC', free: '0.2' }
    ]

    const [ slaveCurrency, masterCurrency ] = takePairFromSymbol(symbol)
    const openedPositionsOfSymbol = filterBySymbol(symbol)(openedPositions)
    const minQty = getMinQtyFromSymbolInfo(symbolInfo)

    const execBuy = () => {
      const findByMasterCurrency = findByAssetProp(masterCurrency)
      const avaliableToBuy = o(parseFreeProp, findByMasterCurrency)(balances)
      const avaliableChunks = subtract(chunksNumber, length(openedPositions))
      const chunkAmount = divide(avaliableToBuy, avaliableChunks)
      const quantity = roundToMinQty(minQty, divide(chunkAmount, price))
      const error = buyErrorsCondition({ avaliableChunks, quantity, openedPositionsOfSymbol })

      return { quantity, error }
    }

    const execSell = () => {
      const findBySlaveCurrency = findByAssetProp(slaveCurrency)
      const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
      const positionToCover = findPositionToCover(forced ? Infinity : price, openedPositionsOfSymbol)
      const chunkAmount = path([ 'open', 'origQty' ], positionToCover)
      const quantity = roundToMinQty(minQty, chunkAmountToSellCond([ avaliableToSell, chunkAmount ]))
      const error = sellErrorsCondition({ positionToCover, quantity, avaliableToSell })

      return { quantity, error, positionToCover }
    }

    const getTradeSide = ifElse(equals('BUY'), execBuy, execSell)
    const { quantity, error, positionToCover } = getTradeSide(side)
    if (error) throw error

    const positionState = equals('BUY', side) ?
      await trade({ price, sendOrder, myTrades, openPosition, position: { account, symbol, quantity } }) :
      await trade({ price, sendOrder, myTrades, closePosition, positionToCover })

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
