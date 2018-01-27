import { log, error as logError } from '../utils/log'

import {
  __, o, cond, always, mergeAll, unapply, ifElse, equals, apply, multiply,
  reject, complement, converge, match, gte, nth, last, sortBy, curry, divide,
  length, subtract, not, contains, propSatisfies, reduce, concat, filter, lt,
  compose, prop, map, flip, invoker, propEq, find, T, gt, isNil, pair, both,
  append, defaultTo, head, uniq, curryN, of, add, split, join, prepend, repeat
} from 'ramda'

import {
  parse, stringify, roundToMinQty, getMinQtyFromSymbolInfo, takePairFromSymbol,
  findTradeByOrderId
} from './shared'

// TODO move to account preferences
const numOfChunks = 8
const minProfit = 0.006
const comissionPerc = 0.1

const isNotEquals = complement(equals)
const propPrice = prop('price')
const findByAssetProp = o(find, propEq('asset'))
const parseFreeProp = o(parseFloat, prop('free'))
const filterBySymbol = o(filter, propEq('symbol'))
const filterBuys = filter(propEq('side', 'BUY'))
const filterSells = filter(propEq('side', 'SELL'))
const getAllCoveredIds = compose(reduce(concat, []), map(prop('coveredIds')))
// TODO: refactor this fn later
const getNotCovered = (ids: number[], buys: {}[]) => filter(propSatisfies(o(not, contains(__, ids)), 'id'))(buys)
const getOpenedPositions = converge(getNotCovered, [ o(getAllCoveredIds, filterSells), filterBuys ])

const floatProp = curryN(2, compose(parseFloat, prop))
const subtractSellComission = converge(subtract, [ floatProp('qty'), converge(divide, [ floatProp('commission'), floatProp('price') ]) ])
const subtractBuyComission = converge(subtract, [ floatProp('qty'), floatProp('commission') ])

const minCoverPrice = converge(subtract, [ nth(0), apply(multiply) ])
const findOrderByMinPrice = (minPrice: number) => compose(last, sortBy(propPrice), filter(o(gte(minPrice), propPrice)))
const findOrderToCover = compose(findOrderByMinPrice, minCoverPrice)

const getProfitValue = curry((buy, sell) => (sell * 100 / buy) - 100)
const getProfitFromPosAndTrade = converge(getProfitValue, [ o(propPrice, nth(0)), o(floatProp('price'), nth(1)) ])
const calcProfit = compose(flip(subtract)(comissionPerc), unapply(getProfitFromPosAndTrade))

const notContains = complement(contains)
const buySignalSymbolIsNotEnabled = both(propEq('type', 'BUY'), converge(notContains, [ prop('symbol'), prop('enabledSymbols') ]))
const getIdListOfPosition = ifElse(isNil, always(null), o(of, prop('id')))
const addSymbolToList = compose(stringify, uniq, converge(append, [ head, compose(parse, defaultTo([]), last) ]))
const removeSymbolFromList = o(stringify, converge(reject, [ o(equals, head), compose(defaultTo([]), parse, defaultTo('[]'), last) ]))
const lastPositionIsClosed = both(o(propEq('side', 'SELL'), prop('position')), o(propEq('length', 1), prop('openedPositions')))
const fundsNotAccomodatesTwoChunks = unapply(converge(lt, [ head, o(multiply(2), last) ]))
const chunkAmountToSellCond = ifElse(fundsNotAccomodatesTwoChunks, head, last)

const buyErrorsCondition = cond([
  [ o(equals(0), prop('avaliableChunks')), always(Error('Too much opened positions')) ],
  // [ o(gt(0.001), prop('quantity')), always(Error('No funds avaliable to buy')) ],
  [ T, always(null) ]
])
const sellErrorsCondition = cond([
  [ o(isNil, prop('positionToCover')), always(Error('No position to cover')) ],
  [ converge(gt, [ prop('quantity'), prop('avaliableToSell') ]), always(Error('No funds avaliable to cover position')) ],
  [ T, always(null) ]
])

type SignalRequest = { symbol: string, type: 'BUY' | 'SELL', price: number }
const checkSignal = (account: string, requests: any) =>
  async ({ symbol, type, price }: SignalRequest) => {
  try {
    const {
      accountInfo,
      getAccountActiveSymbols,
      getEnabledToBuySymbols,
      getExchangeInfoOfSymbol,
      getPositions,
      myTrades,
      sendOrder,
      setAccountActiveSymbols,
      setPosition
    } = requests

    const enabledSymbols: string = await getEnabledToBuySymbols(null)

    if (buySignalSymbolIsNotEnabled({ type, symbol, enabledSymbols }))
      throw Error(`Symbol ${symbol} is not active, skip BUY signal.`)

    const [ rawInfoSymbol, rawPositions, { balances } ] = await Promise.all([
      getExchangeInfoOfSymbol(symbol), getPositions(null), accountInfo(null),
    ])

    const [ slaveCurrency, masterCurrency ] = takePairFromSymbol(symbol)
    const minQty = o(getMinQtyFromSymbolInfo, parse)(rawInfoSymbol)
    const positions = map(parse, rawPositions)
    const openedPositions = getOpenedPositions(positions)
    const openedPositionsOfSymbol = o(getOpenedPositions, filterBySymbol(symbol))(positions)

    const execBuy = () => {
      const findByMasterCurrency = findByAssetProp(masterCurrency)
      const avaliableToBuy: number = o(parseFreeProp, findByMasterCurrency)(balances)
      const avaliableChunks = o(subtract(numOfChunks), length)(openedPositions)
      const chunkAmount = divide(avaliableToBuy, avaliableChunks)
      const quantity = roundToMinQty(minQty, chunkAmount)
      log({ minQty, quantity, chunkAmount })
      const error = buyErrorsCondition({ avaliableChunks, quantity, avaliableToBuy })

      return { quantity, error, positionToCover: null }
    }

    const execSell = () => {
      const findBySlaveCurrency = findByAssetProp(slaveCurrency)
      const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
      const positionToCover = findOrderToCover([ price, minProfit ])(openedPositionsOfSymbol)
      const chunkAmount = prop('comissionIncQty', positionToCover)
      const quantity = roundToMinQty(minQty, chunkAmountToSellCond([ avaliableToSell, chunkAmount ]))
      const error = sellErrorsCondition({ positionToCover, quantity, avaliableToSell })

      return { quantity, error, positionToCover }
    }

    const getTradeSide = ifElse(equals('BUY'), execBuy, execSell)
    const getComissionQty = ifElse(equals('BUY'), always(subtractBuyComission), always(subtractSellComission))
    const { quantity, error, positionToCover } = getTradeSide(type)
    if (error) throw error

    log({ symbol, quantity, side: type })
    const order = await sendOrder({ symbol, quantity, side: type, type: 'MARKET' })
    const trades = await myTrades({ symbol, limit: 10 })

    const trade = findTradeByOrderId(prop('orderId', order), trades)
    const comissionIncQty = getComissionQty(type)(trade)
    const profit = defaultTo(null, calcProfit(positionToCover, trade))
    const coveredIds = getIdListOfPosition(positionToCover)
    const position = mergeAll([ order, trade, { comissionIncQty, profit, coveredIds } ])

    const positionStoreStatus = await setPosition(position)
    const rawActiveSymbols = await getAccountActiveSymbols(null)

    if (lastPositionIsClosed({ position, openedPositions }))
      await setAccountActiveSymbols(removeSymbolFromList([ symbol, rawActiveSymbols ]))
    else
      await setAccountActiveSymbols(addSymbolToList([ symbol, rawActiveSymbols ]))

    log(position)

  } catch (err) {
    const errorEvent = {
      type: 'orderExecutionError',
      error: err.message || err,
      method: type,
      account,
      symbol,
      price
    }
    logError(errorEvent)
  }
}

export default checkSignal
