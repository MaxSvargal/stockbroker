import { map, merge, o, reject, equals, last, ifElse, always, both } from 'ramda'
import { closePricesAsValues, makeSignal } from './check'
import { calcStochRsi, stochRsiIsFall, stochRsiAboveMedium } from './indicators'

type Symbol = string
type Candle = any[]
type SymbolCandles = [ Symbol, Candle[] ]

const stochRsiProps = { rsiPeriod: 14, stochasticPeriod: 7, kPeriod: 3, dPeriod: 4 }
const stochRsiCheck = o(both(stochRsiIsFall, stochRsiAboveMedium), calcStochRsi)
const checkFn = o(o(stochRsiCheck, merge(stochRsiProps)), closePricesAsValues)
const checkSignal = ifElse(o(checkFn, last), makeSignal('SELL'), always(null))
const main = o(reject(equals(null)), map(checkSignal))

export default main
