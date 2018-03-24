import {
  all, allPass, apply, assoc, both, compose, converge, gt, last, lt, map, mergeAll, nth, o, objOf,
  pair, prop, unapply,
} from 'ramda'
import { bollingerbands, cci, ema, obv, williamsr } from 'technicalindicators'

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
const calcCCI = compose(cci, assocPeriod(20), prepareCandlesToCCI)
const calcEMA = compose(last, ema, assocPeriod(4), objOf('values'))
const calcEMAMedium = compose(last, ema, assocPeriod(9), objOf('values'))
const calcEMALong = compose(last, ema, assocPeriod(28), objOf('values'))
const pairEmaAndLast = converge(pair, [ calcEMA, last ])
const pairEmaShortAndLong = o(converge(pair, [ calcEMAMedium, calcEMALong ]), prepareCandlesToEMA)

const isGrow = <(a: any) => boolean>apply(lt)
const isGrowAbs = <(a: any) => boolean>apply(gt)
const isOverZero = <any>all(lt(0))

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

export {
  wrIsStartedGrow,
  wrIsJustGrow,
  wrIsNotOverbought,
  obvIsGrow,
  cciIsGrow,
  emaIsPositive,
  bbIsNotOverbought,
}
