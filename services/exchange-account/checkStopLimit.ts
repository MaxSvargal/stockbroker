import {
  o, converge, lt, prop, map, compose, flip, head, forEach, when, equals, zip,
  merge, always, objOf, nth, last
} from 'ramda'

import trade from './modules/trade'

const mapSellState = (prices: {}, positions: {}[]) =>
  map(converge(lt, [
    compose(<any>parseFloat, flip(prop)(prices), <any>prop('symbol')),
    prop('riftPrice')
  ]), positions)

const sellStateIsTrue = compose(equals(true), last)

const checkStopLimit = requests => async () => {
  const { getOpenedPositions, getPrices, closePosition, sendOrder, myTrades } = requests
  const [ openedPositions, prices ] = await Promise.all([ getOpenedPositions(null), getPrices(null) ])

  const state = mapSellState(prices, openedPositions)
  const statePositions = zip(openedPositions, state)

  const makeTradeProps = converge(merge, [
    o(objOf('price'), o(nth(3), last)), // only for tests
    converge(merge, [ always({ closePosition, sendOrder, myTrades }), o(objOf('positionToCover'), head) ])
  ])
  forEach(when(sellStateIsTrue, o(trade, makeTradeProps)), statePositions)
}

export default checkStopLimit
