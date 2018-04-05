import {
  all, allPass, apply, assoc, both, compose, converge, gt, last, lt, map, mergeAll, nth, o, objOf,
  pair, prop, unapply, merge, head, curryN, takeLast, any
} from 'ramda'
import { bollingerbands, cci, ema, obv, williamsr } from 'technicalindicators'

const curryBinary = o(curryN(2), unapply)
const propsPeriodAndValues = curryBinary(converge(merge, [ o(objOf('period'), head), o(objOf('values'), last) ]))

const objOpen = o(objOf('open'), map(o(parseFloat, nth(1))))
const objHigh = o(objOf('high'), map(o(parseFloat, nth(2))))
const objLow = o(objOf('low'), map(o(parseFloat, nth(3))))
const objClose = o(objOf('close'), map(o(parseFloat, nth(4))))
const objVolume = o(objOf('volume'), map(o(parseInt, nth(5))))
const objValues = o(objOf('values'), map(o(parseFloat, nth(4))))

const assocPeriod = assoc('period')
const assocStdDev = assoc('stdDev')
const prepareCandlesToWR = converge(unapply(mergeAll), [ objLow, objClose, objHigh ])
const prepareCandlesToOBV = converge(unapply(mergeAll), [ objClose, objVolume ])
const prepareCandlesToCCI = converge(unapply(mergeAll), [ objOpen, objHigh, objLow, objClose ])
const prepareCandlesToEMA = map(o(parseFloat, nth(4)))
const calcWR = compose(williamsr, assocPeriod(7), prepareCandlesToWR)
const calcBB = compose(bollingerbands, assocPeriod(21), assocStdDev(2), objValues)
const calcOBV = compose(obv, prepareCandlesToOBV)
const calcCCI = compose(cci, assocPeriod(30), prepareCandlesToCCI)
const calcEMA = compose(last, ema, assocPeriod(7), objOf('values'))
const calcEMAMedium = compose(last, ema, assocPeriod(9), objOf('values'))
const calcEMALong = compose(last, ema, assocPeriod(28), objOf('values'))
const pairEmaAndLast = converge(pair, [ calcEMA, last ])
const pairEmaShortAndLong = o(converge(pair, [ calcEMAMedium, calcEMALong ]), prepareCandlesToEMA)

const calcWR7 = compose(williamsr, assocPeriod(7), prepareCandlesToWR)
const calcWR14 = compose(williamsr, assocPeriod(14), prepareCandlesToWR)

const calcEMA7 = o(ema, propsPeriodAndValues(7))
const calcEMA14 = o(ema, propsPeriodAndValues(14))
const calcCciEmaPair = o(converge(pair, [ calcEMA7, calcEMA14 ]), calcCCI)
const calcObvEmaPair = o(converge(pair, [ calcEMA7, calcEMA14 ]), calcOBV)

const isGrow = <(a: any) => boolean>apply(lt)
const isGrowAbs = <(a: any) => boolean>apply(gt)
const isOverZero = <any>all(lt(0))
const pairIsGrow = o(apply(gt), map(last))
const lastIsOverZero = o(lt(0), last)

const wrPair = o(pairEmaAndLast, calcWR)
const wrNotOverbought = o(gt(-20), last)
const wrNotOversold = o(lt(-80), last)
const wrIsJustGrow = o(isGrow, wrPair)
const wrIsStartedGrow = o(allPass([ isGrow, wrNotOverbought, wrNotOversold ]), wrPair)
const wrIsNotOverbought = o(both(isGrow, wrNotOverbought), wrPair)
const obvIsGrow = compose(isGrow, pairEmaAndLast, calcOBV)
const cciIsGrow = compose(both(isGrow, isOverZero), pairEmaAndLast, calcCCI)
const emaIsPositive = compose(isGrowAbs, pairEmaShortAndLong)
const bbIsNotOverbought = compose(both(gt(1), lt(0.5)), o(prop('pb'), last), calcBB)

const obvEmaIsGrow = o(pairIsGrow, calcObvEmaPair)
const cciEmaIsGrow = o(pairIsGrow, calcCciEmaPair)
const cciIsOverZero = o(lastIsOverZero, calcCCI)

const wr7IsNotOverbought = compose(wrNotOverbought, pairEmaAndLast, calcWR7)
const wr14IsNotOverbought = compose(wrNotOverbought, pairEmaAndLast, calcWR14)
const wr14IsBeginGrow = compose(allPass([ isGrow, wrNotOverbought, wrNotOversold ]), takeLast(2), calcWR14)

export {
  wrIsStartedGrow,
  wrIsJustGrow,
  wrIsNotOverbought,
  obvIsGrow,
  cciIsGrow,
  emaIsPositive,
  bbIsNotOverbought,
  calcCciEmaPair,
  cciEmaIsGrow,
  cciIsOverZero,
  obvEmaIsGrow,
  wr7IsNotOverbought,
  wr14IsNotOverbought,
  wr14IsBeginGrow
}
