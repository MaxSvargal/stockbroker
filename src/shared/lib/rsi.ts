import {
  CurriedFunction3, KeyValuePair,
  map, nth, pair, compose, o, ifElse, subtract, mapAccum, lt, reverse, always,
  converge, divide, add, length, curry, reduce, multiply, identity, sum, apply
} from 'ramda'

interface RSI { (candles: number[][]): number }
interface CalcEMA extends CurriedFunction3<number, number, number, any> { (): number }
interface ToPairs { (a: number, b: number): [number, KeyValuePair<number, number>] }

const getThirds = map(nth(2))
const toPairs: ToPairs = (a, b) => [ b, pair(a, b) ]
const arrToPairs = compose(nth(1), mapAccum(toPairs, 0))
const getChange = ifElse(apply(lt), apply(subtract), always(0))
const calcUDChange = (a: [number, number]) => map(getChange, [ a, reverse(a) ])
const UD = compose(map(calcUDChange), arrToPairs, getThirds)

const SMA = converge(divide, [ sum, length ])
const multiplier = compose(divide(2), add(1), length)
const calcEMA = <CalcEMA>curry((m: number, a: number, b: number) => compose(add(a), multiply(m), subtract(b))(a))
const EMA = converge(reduce, [ o(calcEMA, multiplier), SMA, identity ])
const EMAofPart = curry((i: number) => o(EMA, map(nth(i))))

const RSofUD = converge(divide, [ EMAofPart(0), EMAofPart(1) ])
const RSIComp = compose(subtract(100), divide(100), add(1))
const RSI = <RSI>compose(RSIComp, RSofUD, UD)

export default RSI
