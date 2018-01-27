import { error } from '../utils/log'
import {
  o, compose, reduce, concat, map, prop, curryN, unapply, filter, always, flip,
  objOf, sum, find, subtract, divide, multiply, evolve, toString, nth, equals, length,
  converge, propEq, last, head, reject, propSatisfies, contains, pair, identity,
} from 'ramda'

import {
  getMinQtyFromSymbolInfo, roundToMinQty, takePairFromSymbol, parse, findTradeByOrderId
} from './shared'

const propId = prop('id')
const propOrderId = prop('orderId')
const propPrice = o(parseFloat, prop('price'))
const propExecutedQty = o(parseFloat, prop('executedQty'))

const lengthIsZero = o(equals(0), length)
const curryUnary = o(<any>curryN(2), <any>unapply)
const curryUnary3 = o(<any>curryN(3), <any>unapply)
const filterBySymbol = curryUnary(converge(filter, [ o(<any>propEq('symbol'), last), head ]))
const filterBuys = filter(propEq('side', 'BUY'))
const filterSells = filter(propEq('side', 'SELL'))
const getAllCoveredIds = compose(reduce(concat, []), map(prop('coveredIds')))
const idContainsInList = converge(propSatisfies, [ o(flip(contains), head), always('id') ])
const getNotCovered = unapply(converge(reject, [ idContainsInList, last ]))
const getByList = unapply(converge(filter, [ idContainsInList, last ]))
const getOpenedPositions = converge(getNotCovered, [ o(getAllCoveredIds, filterSells), filterBuys ])

const getProfitValue = curryUnary(converge(subtract, [ converge(divide, [ converge(multiply, [ head, always(100) ]), last ]) , always(100) ]))
const getProfitOfQuantity = curryUnary3(converge(multiply, [ converge(getProfitValue, [ nth(1), nth(2) ]), nth(0) ]))

const parseFreeProp = o(parseFloat, prop('free'))
const findByAssetProp = o(find, propEq('asset'))

type Requests = {
  getExchangeInfoOfSymbol: Function,
  accountInfo: Function,
  getPositions: Function,
  sendOrder: Function,
  myTrades: Function,
  setPosition: Function
}
type CheckOrderSignal = (requests: Requests) => (symbols: string[]) => void
const checkOrderSignal: CheckOrderSignal = requests => async symbols => {
  const { getExchangeInfoOfSymbol, accountInfo, getPositions, setPosition, sendOrder, myTrades } = requests

  const [ rawPositions, { balances } ] = await Promise.all([ getPositions(null), accountInfo(null) ])
  const positions = map(parse, rawPositions)
  const filterSymbol = filterBySymbol(positions)
  const getOpenedPositionsBySymbol = o(getOpenedPositions, filterSymbol)

  const execForSymbol = async (symbol: string) => {
    try {
      console.log('START EXIT FROM SYMBOL', symbol)
      const openedPositions = getOpenedPositionsBySymbol(symbol)
      console.log({ openedPositions })
      if (lengthIsZero(openedPositions)) return null

      const rawInfoSymbol = await getExchangeInfoOfSymbol(symbol)
      const minQty = o(getMinQtyFromSymbolInfo, parse)(rawInfoSymbol)

      const [ slaveCurrency ] = takePairFromSymbol(symbol)
      const findBySlaveCurrency = findByAssetProp(slaveCurrency)
      const avaliableToSell = o(parseFreeProp, findBySlaveCurrency)(balances)
      const quantity = roundToMinQty(minQty, avaliableToSell)

      const order = await sendOrder({ symbol, quantity, side: 'SELL', type: 'MARKET' })
      const trades = await myTrades({ symbol, limit: 10 })

      const trade = findTradeByOrderId(propOrderId(order), trades)
      const profitOfSellPrice = o(getProfitOfQuantity, propPrice)(trade)
      const getProfitOfPosition = converge(profitOfSellPrice, [ propPrice, propExecutedQty ])
      const profit = o(sum, map(getProfitOfPosition))(openedPositions)
      const coveredIds = map(propId, openedPositions)
      const position = { ...order, ...trade, profit, coveredIds }

      return await setPosition(position)
    } catch (err) {
      error(err)
    }
  }

  map(execForSymbol, symbols)
}

export default checkOrderSignal
