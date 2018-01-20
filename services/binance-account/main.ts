import debug from 'debug'
import {
  __, o, cond, always, mergeAll, unapply, ifElse, equals, apply, multiply,
  reject, complement, converge, match, gte, nth, last, sortBy, curry, divide,
  length, subtract, not, contains, propSatisfies, reduce, concat, filter,
  compose, prop, map, applyTo, flip, invoker, propEq, find, splitEvery, T, gt,
  isNil, pair, when, both, append, defaultTo
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
type Account = string
type Main = (a: ExitProcess, b: Binance, c: Subscriber, d: Requester, e: Account) => void

const invokeSend = flip(invoker(1, 'send'))
const invokeAccountInfo = flip(invoker(1, 'accountInfo'))
// TODO: enable production
const invokeOrder = flip(invoker(1, 'orderTest'))
const invokeMyTrades = flip(invoker(1, 'myTrades'))

const requestPositions = (account: string) => ({
  type: 'cacheHashGetValues',
  key: `${account}:positions`
})
const requestSetPosition = (account: string) => (position: {}) => ({
  type: 'cacheHashSet',
  key: `${account}:positions`,
  field: prop('id', position),
  value: JSON.stringify(position)
})
const requestActiveSymbol = {
  type: 'cacheHashGet',
  key: 'tradeState',
  field: 'currentSymbol'
}
const requestAccountActiveSymbols = (account: string) => ({
  type: 'cacheHashGet',
  key: 'accounts:activeSymbols',
  field: account
})
const requestSetAccountActiveSymbols = (account: string) => (symbols: string[]) => ({
  type: 'cacheHashSet',
  key: 'accounts:activeSymbols',
  field: account,
  value: symbols
})

const numOfChunks = 4
const minProfit = 0.005
const isNotEquals = complement(equals)
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
const takePairFromSymbol = compose(converge(pair, [ nth(1), nth(2) ]), match(/(.+)(...)/))
const skipBuySignalByEqualActiveSymbol = both(propEq('type', 'BUY'), converge(isNotEquals, [ prop('activeSymbol'), prop('symbol') ]))
const symbolNotLastIsset = converge(isNotEquals, [ prop('activeSymbol'), compose(last, defaultTo([]), prop('accountActiveSymbols')) ])
const removeFromList = unapply(converge(reject, [ o(equals, nth(0)), nth(1) ]))
const lastPositionIsClosed = both(o(propEq('side', 'SELL'), prop('position')), o(propEq('length', 1), prop('openedPositions')))

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

  const propagateSignalStream = fromEvent('newSignal', subscriber)
  const binanceInvokers = [ invokeAccountInfo, invokeOrder, invokeMyTrades ]
  const [ accountInfo, sendOrder, myTrades ] = map(applyTo(binance), binanceInvokers)

  const send = invokeSend(requester)
  const sendSetPosition = compose(send, requestSetPosition(account))
  const getAccountActiveSymbols = requestAccountActiveSymbols(account)
  const setAccountActiveSymbols = requestSetAccountActiveSymbols(account)
  const getPositions = requestPositions(account)

  type SignalRequest = { symbol: string, type: 'BUY' | 'SELL', price: number }
  const checkSignal = async ({ symbol, type, price }: SignalRequest) => {
    try {
      const activeSymbol: string = await send(requestActiveSymbol)

      if (skipBuySignalByEqualActiveSymbol({ type, symbol, activeSymbol }))
        throw Error(`Symbol ${symbol} is not active, skip BUY signal.`)

      const [ accountActiveSymbols, positions, { balances } ] = await Promise.all(
        concat(map(send, [ getAccountActiveSymbols, getPositions ]), [ accountInfo(null) ])
      )

      if (symbolNotLastIsset({ activeSymbol, accountActiveSymbols })) {
        await send(setAccountActiveSymbols(JSON.stringify(append(activeSymbol, accountActiveSymbols))))
      }

      const [ slaveCurrency, masterCurrency ] = takePairFromSymbol(symbol)
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
        const findBySlaveCurrency = findByAssetProp(slaveCurrency)
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
      debug('dev')('Order requested:', order)

      // const trades = await myTrades({ symbol, limit: 10 })
      // const trade = findTradeByOrderId(prop('orderId', order), trades)
      const trade = { executedQty: quantity, price, side: type, symbol, created: new Date().getTime() }
      const profit = calcProfit(positionToCover, trade)
      const coveredIds = positionToCover && [ prop('id', positionToCover) ]
      const position = mergeAll([ order, trade, { profit, coveredIds } ])

      debug('dev')(position)
      const positionStoreStatus = await sendSetPosition(position)

      if (lastPositionIsClosed({ position, openedPositions })) {
        await send(setAccountActiveSymbols(JSON.stringify(removeFromList(activeSymbol, accountActiveSymbols))))
      }

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
