import {
  o, converge, lt, prop, map, compose, flip, head, forEach, when, equals, zip,
  merge, always, objOf, nth, last, add, pair, path, subtract, multiply
} from 'ramda'

import trade from './modules/trade'

const sellStateIsTrue = compose(equals(true), last)

const getSymbolPrice = (prices) => compose(parseFloat, flip(prop)(prices), prop('symbol'))
const pairOpenPriceVolatility = converge(pair, [ path(['open', 'price']), prop('volatilityPerc') ])
const marginWithIncrease = (inc) => converge(subtract, [ head, converge(multiply, [ head, o(add(inc), last) ]) ])
const mapSellState = (prices: string[], positions: {}[]) =>
  // TODO: simplify it, calculate increased value by another method
  map(converge(lt, [ getSymbolPrice(prices), o(marginWithIncrease(0.05), pairOpenPriceVolatility) ]), positions)

const checkStopLimit = requests => async () => {
  const { getOpenedPositions, getPrices, closePosition, sendOrder, myTrades } = requests
  const [ openedPositions, prices ] = await Promise.all([ getOpenedPositions(null), getPrices(null) ])

  const state = mapSellState(prices, openedPositions)
  const statePositions = zip(openedPositions, state)
  const makeTradeProps = converge(merge, [
    compose(objOf('price'), getSymbolPrice(prices), head), // only for tests
    converge(merge, [ always({ closePosition, sendOrder, myTrades }), o(objOf('positionToCover'), head) ])
  ])

  forEach(when(sellStateIsTrue, o(trade, makeTradeProps)), statePositions)
}

export default checkStopLimit
