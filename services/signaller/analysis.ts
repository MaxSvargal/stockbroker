import {
  any, both, equals, gt, head, last, lt, map, nth, o, prop, takeLast, apply, props, compose, merge, objOf
} from 'ramda'
import { stochasticrsi } from 'technicalindicators'

import log from '../utils/log'

type CompareStochRsi = (a: { k: number, d: number }[]) => boolean[]
const compareStochRsi: CompareStochRsi = compose(map(apply(gt)), map(props([ 'k', 'd' ])), takeLast(2)) as any
const isSRUp = o(both(o(equals(false), head), o(equals(true), last)), compareStochRsi)
const isSRDrop = o(both(o(equals(true), head), o(equals(false), last)), compareStochRsi)
const mapClosePrices = map(o(parseFloat, nth(4)))
const stochRsiProps = { rsiPeriod: 14, stochasticPeriod: 12, kPeriod: 3, dPeriod: 4 }
const isSRNotOverbought = compose(gt(50), prop('stochRSI'), last)
const isSRNotOversold = compose(lt(50), prop('stochRSI'), last)

type MakeAnalysis = (a: string) => (xs: number[][][]) =>
  { symbol: string, side: string, price: number, time: number } | null

const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles15m ]) => {
  const shortClosePrices = mapClosePrices(candles1m)
  const longClosePrices = mapClosePrices(candles15m)

  const rsiStochShort = stochasticrsi(merge(stochRsiProps, objOf('values', shortClosePrices)))
  const rsiStochLong = stochasticrsi(merge(stochRsiProps, objOf('values', longClosePrices)))
  const lastPrice = last(shortClosePrices)

  const buySignal = both(isSRNotOverbought, isSRUp)(rsiStochShort)
  const sellSignal = both(isSRNotOversold, isSRDrop)(rsiStochLong)
  const forcedSellSignal = false //sellPass(wrVLong)

  // log({
  //   now: new Date().toLocaleString(),
  //   close: last(closeShort),
  //   wrShortList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong)
  // })

  if (any(equals(true))([ buySignal, sellSignal, forcedSellSignal ])) {
    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${lastPrice} }`)
    return {
      symbol,
      side: buySignal ? 'BUY' : 'SELL',
      price: lastPrice,
      time: new Date().getTime(),
      forced: forcedSellSignal,
    }
  } else {
    log(`${symbol} has no signal at ${lastPrice}`)
  }

  return null
}

export default makeAnalysis
