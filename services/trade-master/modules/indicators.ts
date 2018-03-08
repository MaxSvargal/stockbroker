import { o, objOf, map, nth, assoc, converge, unapply, mergeAll, compose, head, last, lt, gt, both, allPass, pair } from 'ramda'
import { williamsr, bollingerbands, ema } from 'technicalindicators'

const objHigh = o(objOf('high'), map(o(parseFloat, nth(2))))
const objLow = o(objOf('low'), map(o(parseFloat, nth(3))))
const objClose = o(objOf('close'), map(o(parseFloat, nth(4))))
const objValues = o(objOf('values'), map(o(parseFloat, nth(4))))
const assocPeriod = assoc('period')
const assocStdDev = assoc('stdDev')
const prepareCandlesToWR = converge(unapply(mergeAll), [ objLow, objClose, objHigh ])
const calcWR = compose(williamsr, assocPeriod(14), prepareCandlesToWR)
const calcBB = compose(bollingerbands, assocPeriod(21), assocStdDev(2), objValues)
const calcEMA = compose(last, ema, assocPeriod(4), objOf('values'))

const pairEmaAndLast = converge(pair, [ calcEMA, last ])
const wrPair = o(pairEmaAndLast, calcWR)
const wrIsGrow = converge(lt, [ head, last ])
const wrNotOverbought = o(gt(-20), last)
const wrNotOversold = o(lt(-80), head)
const wrIsJustGrow = o(wrIsGrow, wrPair)
const wrIsGrowAndNotOverbought = o(both(wrIsGrow, wrNotOverbought), wrPair)
const wrIsStartedGrow = o(allPass([ wrIsGrow, wrNotOverbought, wrNotOversold ]), wrPair)

export { wrIsStartedGrow }