import { log, error as logError } from '../utils/log'
import {
  o, cond, always, unapply, ifElse, equals, reject, complement, converge, last, divide, uniq,
  length, subtract, contains, filter, prop, propEq, find, T, gt, isNil, both, append, head, path
} from 'ramda'

import trade from './modules/trade'
import { roundToMinQty, getMinQtyFromSymbolInfo, takePairFromSymbol, findTradeByOrderId } from './shared'
import { findOrderToCover, chunkAmountToSellCond, makeOpenedPosition, makeClosedPosition, Order, Trade, Position } from './modules/positions'

const findByAssetProp = o(find, propEq('asset'))
const parseFreeProp = o(parseFloat, prop('free'))
const filterBySymbol = o(filter, propEq('symbol'))

const buySignalSymbolIsNotEnabled = both(propEq('side', 'BUY'), converge(complement(contains), [ prop('symbol'), prop('enabledSymbols') ]))
const lastPositionIsClosed = both(o(equals('SELL'), head), o(propEq('length', 1), last))
const addSymbolToList = unapply(o(uniq, converge(append, [ head, last ])))
const removeSymbolFromList = unapply(converge(reject, [ o(equals, head), last ]))

const buyErrorsCondition = cond([
  [ o(equals(0), prop('avaliableChunks')), always(Error('Too much opened positions')) ],
  [ o(equals(0), prop('quantity')), always(Error('No funds avaliable to buy')) ],
  [ T, always(null) ]
])
const sellErrorsCondition = cond([
  [ o(isNil, prop('positionToCover')), always(Error('No position to cover')) ],
  [ converge(gt, [ prop('quantity'), prop('avaliableToSell') ]), always(Error('No funds avaliable to cover position')) ],
  [ T, always(null) ]
])

type SignalRequest = { symbol: string, side: 'BUY' | 'SELL', price: number }
const checkSignal = (account: string, requests: any) =>
  async ({ symbol, side, price }: SignalRequest) => {
  try {
    const {
      getAccount,
      setAccountSymbols,
      getOpenedPositions,
      getSymbolInfo,
      getSymbolsEnabled,
      openPosition,
      closePosition,
      accountInfo,
      sendOrder,
      myTrades
    } = requests

    const { values: enabledSymbols } = await getSymbolsEnabled(null)

    if (buySignalSymbolIsNotEnabled({ side, symbol, enabledSymbols }))
      throw Error(`Symbol ${symbol} is not active, skip BUY signal.`)

    let [
      symbolInfo,
      openedPositions,
      { activeSymbols, preferences: { chunksNumber = 8, profitMin = 0.01 } },
      { balances }
    ] = await Promise.all([
      getSymbolInfo(symbol),
      getOpenedPositions(null),
      getAccount(null),
      accountInfo(null)
    ])

    balances = [ { asset: 'ETH', free: '1.00000000', locked: '0.00000000' } ]

    const [ slaveCurrency, masterCurrency ] = takePairFromSymbol(symbol)
    const openedPositionsOfSymbol = filterBySymbol(symbol)(openedPositions)
    const minQty = getMinQtyFromSymbolInfo(symbolInfo)

    const execBuy = () => {
      const findByMasterCurrency = findByAssetProp(masterCurrency)
      const avaliableToBuy = o(parseFreeProp, findByMasterCurrency)(balances)
      const avaliableChunks = subtract(chunksNumber, length(openedPositions))
      const chunkAmount = divide(avaliableToBuy, avaliableChunks)
      const quantity = roundToMinQty(minQty, divide(chunkAmount, price))
      const error = buyErrorsCondition({ avaliableChunks, quantity })

      return { quantity, error }
    }

    const execSell = () => {
      const findBySlaveCurrency = findByAssetProp(slaveCurrency)
      const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
      const positionToCover: Position = findOrderToCover([ price, profitMin ], openedPositionsOfSymbol)
      const chunkAmount = path([ 'open', 'origQty' ], positionToCover)
      const quantity = roundToMinQty(minQty, chunkAmountToSellCond([ avaliableToSell, chunkAmount ]))
      const error = sellErrorsCondition({ positionToCover, quantity, avaliableToSell })

      return { quantity, error, positionToCover }
    }

    const getTradeSide = ifElse(equals('BUY'), execBuy, execSell)
    const { quantity, error, positionToCover } = getTradeSide(side)
    if (error) throw error

    const positionState = equals('BUY', side) ?
      await trade({ sendOrder, myTrades, openPosition, position: { account, symbol, quantity, price } }) :
      await trade({ sendOrder, myTrades, closePosition, positionToCover, price })

    if (lastPositionIsClosed([ side, openedPositionsOfSymbol ]))
      await setAccountSymbols(removeSymbolFromList(symbol, activeSymbols))
    else
      await setAccountSymbols(addSymbolToList(symbol, activeSymbols))

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
