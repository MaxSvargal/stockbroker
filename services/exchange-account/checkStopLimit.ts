import {
  filter, curry, converge, lt, o, path, pair, prop, chain, append, subtract,
  last, head, multiply, curryN, unapply, map, compose, takeLast, apply, gte,
  forEach, when, equals, zip, call, merge, always, objOf, nth
} from 'ramda'

import trade from './modules/trade'

// const stopLimitPerc = 0.01
const sellStateIsTrue = compose(equals(true), last, last)
const getSymbolPricePair = converge(pair, [ prop('symbol'), path([ 'open', 'price' ]) ])
const getStopLimitFromPreferences: (a: any) => number = path([ 'preferences', 'stopLimitPerc' ])
const findPriceBySymbol = compose(parseFloat, prop('bidPrice'), converge(prop, [ o(head, last), head ]))
const addCurrentPrice = curryN(2, unapply(converge(append, [ findPriceBySymbol, last ])))
const addSellStatus = chain(append, o(apply(gte), takeLast(2)))

const addStopLimitValue = (limit: number) =>
  chain(append, converge(subtract, [ last, o(multiply(limit), last) ]))

const checkPositionsLimit = (prices: {}, stopLimitPerc: number) =>
  map(compose(addSellStatus, addCurrentPrice(prices), addStopLimitValue(stopLimitPerc), getSymbolPricePair))

const checkStopLimit = requests => async () => {
  const { getAccount, getOpenedPositions, getPrices, closePosition, sendOrder, myTrades } = requests
  const [ account, openedPositions, prices ] = await Promise.all([ getAccount(null), getOpenedPositions(null), getPrices(null) ])

  const stopLimitPerc = getStopLimitFromPreferences(account)
  const state = checkPositionsLimit(prices, stopLimitPerc)(openedPositions)
  const statePositions = zip(openedPositions, state)
  const makeTradeProps = converge(merge, [
    o(objOf('price'), o(nth(3), last)), // only for tests
    converge(merge, [ always({ closePosition, sendOrder, myTrades }), o(objOf('positionToCover'), head) ])
  ])
  forEach(when(sellStateIsTrue, o(trade, makeTradeProps)), statePositions)
}

export default checkStopLimit
