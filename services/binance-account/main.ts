import debug from 'debug'
import {
  __, o, cond, always, mergeAll, unapply, ifElse, equals, apply, multiply,
  converge, gte, nth, last, sortBy, curry, divide, length, subtract, not,
  contains, propSatisfies, reduce, concat, filter, compose, prop, map, applyTo,
  flip, invoker, propEq, find, splitEvery, T, gt, isNil
} from 'ramda'
import { fromEvent, observe, throttle } from 'most'
import { Requester, Subscriber } from 'cote'

type Binance = {
  candles: (a: string) => Promise<any[]>,
  accountInfo: () => Promise<{ balances: { asset: string, free: string, locked: string }[] }>
  order: ({}: { symbol: string, side: 'BUY' | 'SELL', quantity: number, type: 'LIMIT' | 'MARKET' }) => Promise<{ orderId: number, status: 'NEW' }>
  myTrades: ({}: { symbol: string, limit: number }) => Promise<{}[]>
}
type ExitProcess = (a: Error) => void
type Aaccount = string
type Main = (a: ExitProcess, b: Binance, c: Subscriber, d: Requester, e: Account) => void

const invokeSend = flip(invoker(1, 'send'))
const invokeAccountInfo = flip(invoker(1, 'accountInfo'))
const invokeOrder = flip(invoker(1, 'order'))
const invokeMyTrades = flip(invoker(1, 'myTrades'))

const numOfChunks = 4
const minProfit = 0.005
const propPrice = prop('price')
const findByAssetProp = o(find, propEq('asset'))
const parseFreeProp = o(parseFloat, prop('free'))
const filterBySymbol = o(filter, propEq('symbol'))
const filterBuys = filter(propEq('side', 'BUY'))
const filterSells = filter(propEq('side', 'SELL'))
const getAllCoveredIds = compose(reduce(concat, []), map(prop('coveredIds')))
const getNotCovered = (ids: number[]) => filter(propSatisfies(o(not, contains(__, ids)), 'id'))
const minCoverPrice = converge(subtract, [ nth(0), apply(multiply) ])
const getMostExpensiveByPrice = o(last, sortBy(prop('price')))
const findOrderByMinPrice = (minPrice: number) => compose(last, sortBy(prop('price')), filter(o(gte(minPrice), prop('price'))))
const findOrderToCover = compose(findOrderByMinPrice, minCoverPrice)
const findTradeByOrderId = unapply(converge(find, [ o(propEq('orderId'), nth(0)), nth(1) ]))
const whenFirstArgIsset = ifElse(compose(isNil, nth(0)), always(undefined))
const getProfitValue = curry((buy, sell) => (sell * 100 / buy) - 100)
const getProfitFromPositionAndTrade = converge(getProfitValue, [ o(propPrice, nth(0)), compose(parseFloat, propPrice, nth(1)) ])
const calcProfit = unapply(whenFirstArgIsset(getProfitFromPositionAndTrade))
const buyErrorsCondition = cond([
  [ o(equals(0), prop('avaliableChunks')), always(Error('Too much opened positions')) ],
  [ o(gt(0.001), prop('quantity')), always(Error('No funds avaliable to buy')) ],
  [ T, always(null) ]
])
const sellErrorsCondition = cond([
  [ o(isNil, prop('positionToCover')), always(Error('No position to cover')) ],
  [ converge(gt, [ prop('quantity'), prop('avaliableToSell') ]), always(Error('No funds avaliable to cover position')) ],
  [ T, always(null) ]
])

const main: Main = (exitProcess, binance, subscriber, requester, account) => {
  const requestPositions = { type: 'cacheHashGetValues', key: `${account}:positions` }
  const requestStoreSavePosition = (model: {}) => ({
    type: 'cacheHashSet',
    key: `${account}:positions`,
    field: prop('id', model),
    value: JSON.stringify(model)
  })
  const propagateSignalStream = fromEvent('newSignal', subscriber)
  const binanceInvokers = [ invokeAccountInfo, invokeOrder, invokeMyTrades ]
  const [ accountInfo, sendOrder, myTrades ] = map(applyTo(binance), binanceInvokers)
  const send = invokeSend(requester)
  const sendSavePosition = o(send, requestStoreSavePosition)
  const sendRequestPositions = o(send, requestPositions)

  type SignalRequest = { symbol: string, type: 'BUY' | 'SELL', price: number }
  const checkSignal = async ({ symbol, type, price }: SignalRequest) => {
    try {
      const [ slaveCurrrncy, masterCurrency ] = splitEvery(3, symbol)
      const [ positions, { balances } ] = await Promise.all([ send(requestPositions), accountInfo(null) ])
      const positionsOfSymbol = filterBySymbol(symbol)(map(JSON.parse, positions))
      const closedPositionsIds = o(getAllCoveredIds, filterSells)(positionsOfSymbol)
      const openedPositions = o(getNotCovered(closedPositionsIds), filterBuys)(positionsOfSymbol)

      const execBuy = () => {
        const findByMasterCurrency = findByAssetProp(masterCurrency)
        const avaliableToBuy = o(parseFreeProp, findByMasterCurrency)(balances)
        const avaliableChunks = o(subtract(numOfChunks), length)(openedPositions)
        const quantity = divide(divide(avaliableToBuy, avaliableChunks), price)
        const error = buyErrorsCondition({ avaliableChunks, quantity, avaliableToBuy })

        return { quantity: quantity.toFixed(2), error, positionToCover: null }
      }

      const execSell = () => {
        const findBySlaveCurrency = findByAssetProp(slaveCurrrncy)
        const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
        const positionToCover = findOrderToCover([ price, minProfit ])(openedPositions)
        const quantity = prop('executedQty', positionToCover)
        // TODO also check for minimal quantity for symbol
        const error = sellErrorsCondition({ positionToCover, quantity, avaliableToSell })

        return { quantity, error, positionToCover }
      }

      const getTradeSide = ifElse(equals('BUY'), execBuy, execSell)
      const { quantity, error, positionToCover } = getTradeSide(type)
      if (error) throw error

      const order = await sendOrder({ symbol, quantity, side: type, type: 'MARKET' })
      const trades = await myTrades({ symbol, limit: 10 })
      const trade = findTradeByOrderId(prop('orderId', order), trades)
      const profit = calcProfit(positionToCover, trade)
      const coveredIds = positionToCover && [ prop('id', positionToCover) ]
      const position = mergeAll([ order, trade, { profit, coveredIds } ])

      debug('dev')(position)
      const positionStoreStatus = await sendSavePosition(position)

    } catch (error) {
      const errorEvent = {
        type: 'orderExecutionError',
        error: error.message || error,
        method: type,
        account,
        symbol,
        price
      }
      debug('dev')(errorEvent)
      send(errorEvent)
    }
  }
  // TODO: trottle
  observe(checkSignal, throttle(30000, propagateSignalStream))
}

export default main
