import debug from 'debug'
import {
  __, o, cond, always, mergeAll, unapply, ifElse, equals, apply, multiply,
  reject, complement, converge, match, gte, nth, last, sortBy, curry, divide,
  length, subtract, not, contains, propSatisfies, reduce, concat, filter,
  compose, prop, map, applyTo, flip, invoker, propEq, find, splitEvery, T, gt,
  isNil, pair, when, both, append, defaultTo, head, uniq, chain
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
type Main = (a: ExitProcess, b: Binance, c: Subscriber, d: Requester, e: Requester, f: Account) => void

const invokeSend = flip(invoker(1, 'send'))
const invokeAccountInfo = flip(invoker(1, 'accountInfo'))
const invokeOrder = flip(invoker(1, 'order'))
const invokeMyTrades = flip(invoker(1, 'myTrades'))

const requestPositions = (account: string) => ({
  type: 'cacheHashGetValues',
  key: `accounts:${account}:positions`
})
const requestSetPosition = (account: string) => (position: {}) => ({
  type: 'cacheHashSet',
  key: `accounts:${account}:positions`,
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

const numOfChunks = 8
const minProfit = 0.005
const roundDown = (num: number) => Math.floor(num * 100) / 100
const isNotEquals = complement(equals)
const propPrice = prop('price')
const findByAssetProp = o(find, propEq('asset'))
const parseFreeProp = o(parseFloat, prop('free'))
const filterBySymbol = o(filter, propEq('symbol'))
const filterBuys = filter(propEq('side', 'BUY'))
const filterSells = filter(propEq('side', 'SELL'))
const getAllCoveredIds = compose(reduce(concat, []), map(prop('coveredIds')))
// TODO: bug with converge, refactor this fn later
const getNotCovered = (ids: number[], buys: {}[]) => filter(propSatisfies(o(not, contains(__, ids)), 'id'))(buys)
const getOpenedPositions = converge(getNotCovered, [ o(getAllCoveredIds, filterSells), filterBuys ])

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

const stringify = flip(invoker(1, 'stringify'))(JSON)
const parse = flip(invoker(1, 'parse'))(JSON)
const addSymbolToList = o(stringify, converge(append, [ head, o(compose(uniq, parse, defaultTo('[]')), last) ]))
const removeSymbolFromList = o(stringify, converge(reject, [ o(equals, head), compose(parse, defaultTo('[]'), last) ]))
const symbolNotLastIsset = converge(isNotEquals, [ prop('activeSymbol'), compose(last, parse, defaultTo([]), prop('accountActiveSymbols')) ])
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

const main: Main = (exitProcess, binance, subscriber, requesterRespondStore, requesterPersistStore, account) => {

  const propagateSignalStream = fromEvent('newSignal', subscriber)
  const binanceInvokers = [ invokeAccountInfo, invokeOrder, invokeMyTrades ]
  const [ accountInfo, sendOrder, myTrades ] = map(applyTo(binance), binanceInvokers)

  const storeRequest = invokeSend(requesterRespondStore)
  const storePersist = invokeSend(requesterPersistStore)
  const setPosition = requestSetPosition(account)
  const getAccountActiveSymbols = requestAccountActiveSymbols(account)
  const setAccountActiveSymbols = requestSetAccountActiveSymbols(account)
  const getPositions = requestPositions(account)

  type SignalRequest = { symbol: string, type: 'BUY' | 'SELL', price: number }
  const checkSignal = async ({ symbol, type, price }: SignalRequest) => {
    try {
      debug('dev')({ symbol, type, price })
      const activeSymbol: string = await storeRequest(requestActiveSymbol)

      if (skipBuySignalByEqualActiveSymbol({ type, symbol, activeSymbol }))
        throw Error(`Symbol ${symbol} is not active, skip BUY signal.`)

      const [ accountActiveSymbols, rawPositions, { balances } ] = await Promise.all(
        concat(map(storeRequest, [ getAccountActiveSymbols, getPositions ]), [ accountInfo(null) ])
      )

      const [ slaveCurrency, masterCurrency ] = takePairFromSymbol(symbol)
      const positions = map(parse, rawPositions)
      const openedPositions = getOpenedPositions(positions)
      const openedPositionsOfSymbol = o(getOpenedPositions, filterBySymbol(symbol))(positions)

      const execBuy = () => {
        const findByMasterCurrency = findByAssetProp(masterCurrency)
        const avaliableToBuy = o(parseFreeProp, findByMasterCurrency)(balances)
        const avaliableChunks = o(subtract(numOfChunks), length)(openedPositions)
        const quantity = divide(divide(avaliableToBuy, avaliableChunks), price)
        console.log({ avaliableToBuy, avaliableChunks, price, quantity })
        const error = buyErrorsCondition({ avaliableChunks, quantity, avaliableToBuy })

        return { quantity: roundDown(quantity).toString(), error, positionToCover: null }
      }

      const execSell = () => {
        const findBySlaveCurrency = findByAssetProp(slaveCurrency)
        const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
        const positionToCover = findOrderToCover([ price, minProfit ])(openedPositionsOfSymbol)
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
      const positionStoreStatus = await storePersist(setPosition(position))

      if (symbolNotLastIsset({ activeSymbol, accountActiveSymbols })) {
        await compose(storePersist, setAccountActiveSymbols, addSymbolToList)([ activeSymbol, accountActiveSymbols ])
      }

      if (lastPositionIsClosed({ position, openedPositions })) {
        await compose(storePersist, setAccountActiveSymbols, removeSymbolFromList)([ symbol, accountActiveSymbols ])
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
    }
  }
  // TODO: trottle
  observe(checkSignal, throttle(30000, propagateSignalStream))
}

export default main
