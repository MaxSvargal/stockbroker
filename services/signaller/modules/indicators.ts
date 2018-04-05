import { compose, map, apply, gt, lt, prop, props, o, both, equals, head, last, takeLast } from 'ramda'
import { stochasticrsi } from 'technicalindicators'

type StochRsiResult = { stochRSI: number, k: number, d: number }
type StochRsiToProp = (a: StochRsiResult) => number
type CompareStochRsi = (a: { k: number, d: number }[]) => boolean[]
const compareStochRsi: CompareStochRsi = compose(map(apply(gt)), map(props([ 'k', 'd' ]) as any), takeLast(2)) as any

export const calcStochRsi = stochasticrsi
export const stochRsiIsGrow = o(both(o(equals(false), head), o(equals(true), last)), compareStochRsi)
export const stochRsiIsFall = o(both(o(equals(true), head), o(equals(false), last)), compareStochRsi)
export const stochRsiUnderMedium = compose(gt(50), prop('stochRSI') as StochRsiToProp, last)
export const stochRsiAboveMedium = compose(lt(50), prop('stochRSI') as StochRsiToProp, last)