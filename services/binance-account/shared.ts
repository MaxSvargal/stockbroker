import {
  compose, join, prepend, repeat, converge, divide, apply, multiply, last,
  head, unapply, pair, o, add, split, ifElse, equals, always, length, nth, match,
  prop, find, propEq, flip, invoker
} from 'ramda'

const parse = flip(invoker(1, 'parse'))(JSON)
const stringify = flip(invoker(1, 'stringify'))(JSON)

const numToDemention = compose(parseInt, join(''), prepend('1'), repeat('0'))
const roundFloor = converge(divide, [ converge(Math.floor, [ apply(multiply), last ]), head ])
const roundDown = unapply(compose(roundFloor, converge(pair, [ o(numToDemention, head), last ])))
const getDigtOfFloat = compose(add(1), length, head, split('1'), last)
const getDigit = compose(ifElse(o(equals('1'), head), always(0), getDigtOfFloat), split('.'))
const roundToMinQty = unapply(converge(roundDown, [ o(getDigit, head), last ]))

const takePairFromSymbol = compose(converge(pair, [ nth(1), nth(2) ]), match(/(.+)(...)/))
const getMinQtyFromSymbolInfo = compose(prop('minQty'), find(propEq('filterType', 'LOT_SIZE')), prop('filters'))
const findTradeByOrderId = unapply(converge(find, [ o(propEq('orderId'), head), last ]))

export {
  parse,
  stringify,
  roundToMinQty,
  takePairFromSymbol,
  getMinQtyFromSymbolInfo,
  findTradeByOrderId
}
