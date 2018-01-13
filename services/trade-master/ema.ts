import {
  converge, divide, sum, length, compose, add,
  curry, multiply, subtract, reduce, o, identity
} from 'ramda'

type Multiplier = (xs: number[]) => number
const multiplier: Multiplier = compose(divide(2), add(1), length)

type CalcEma = (multiplier: number) => (a: number, b: number) => number
const calcEma: CalcEma = m => (a, b) => compose(add(a), multiply(m), subtract(b))(a)

type SMA = (xs: number[]) => number
const sma: SMA = converge(divide, [ sum, length ])

type EMA = (xs: number[]) => number
const ema: EMA = converge(reduce, [ o(calcEma, multiplier), sma, identity ])

export { sma, ema }
