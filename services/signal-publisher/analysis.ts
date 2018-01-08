import debug from 'debug'
import * as indicators from 'technicalindicators'
import { __, always, any, ifElse, mean, median, either, allPass, curry, compose, all, equals, mapAccum, reduce, or, and, not, range, converge, last, init, head, prop, lt, gt, both, o, juxt, map, nth, takeLast } from 'ramda'

import stochRsi from './stochrsi'

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))
const getCurr = o(head, takeLast(1))
const getPrev = o(head, takeLast(2))
const macdHistogram = map(<any>prop('histogram'))

const rsiPrevIsGreater = o(lt(80), getPrev)
const rsiCurrIsLower = o(gt(80), getCurr)
const rsiFall = both(rsiPrevIsGreater, rsiCurrIsLower)

const rsiCurrIsGreater = o(lt(20), getCurr)
const rsiPrevIsLower = o(gt(20), getPrev)
const rsiGrow = both(rsiCurrIsGreater, rsiPrevIsLower)

const wrPrevIsGreater = o(lt(-20), getPrev)
const wrCurrIsLower = o(gt(-20), getCurr)
const wrFall = both(wrPrevIsGreater, wrCurrIsLower)

const wrCurrIsGreater = o(lt(-80), getCurr)
const wrPrevIsLower = o(gt(-80), getPrev)
const wrGrow = both(wrCurrIsGreater, wrPrevIsLower)

const macdFall = o(converge(gt, [ head, last ]), takeLast(2))
const macdFallSignal = o(converge(lt, [ head, nth(1) ]), takeLast(3))

type MakeAnalysis = (a: number[][][]) => {}
const makeAnalysis: MakeAnalysis = ([ candles1m, candles5m, candles15m ]) => {
  const [ time, open, high, low, close, volume ] = getCandlesParts(candles1m)
  const [ , , , , close5m, volume5m ] = getCandlesParts(candles5m)
  const [ , , , , close15m ] = getCandlesParts(candles15m)

  const bullish = indicators.bullish({ open, close, low, high })
  const bearish = indicators.bearish({ open, close, low, high })
  const obv = indicators.obv({ close: close5m, volume: volume5m })
  const rsi = indicators.rsi({ period: 14, values: close })
  // const stochrsi = stochRsi(rsi)
  const macdShort = macdHistogram(indicators.macd(<any>{ values: close5m, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }))
  const macdLong = macdHistogram(indicators.macd(<any>{ values: close15m, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }))
  const wr = indicators.williamsr({ period: 14, close, low, high })

  const wrIsFall = wrFall(wr)
  const wrIsGrow = wrGrow(wr)
  const macdShortIsFall = macdFall(macdShort)
  const macdShortIsGrow = not(macdShortIsFall)
  const macdLongIsFall = macdFall(macdLong)
  const macdLongIsGrow = not(macdLongIsFall)

  const rsiIsFall = rsiFall(rsi)
  const rsiIsGrow = rsiGrow(rsi)

  const meanLast = compose(mean, init, takeLast(4))
  const meanGrow = converge(lt, [ meanLast, getCurr ])
  const meanFall = converge(gt, [ meanLast, getCurr ])

  const macdIsGrow = meanGrow(macdLong)
  const macdIsFall = meanFall(macdShort)
  const obvIsGrow = meanGrow(obv)
  const obvIsFall = meanFall(obv)

  const buySignal = and(and(macdIsGrow, obvIsGrow), and(wrIsGrow, bullish))
  const sellSignal = and(and(macdIsFall, obvIsFall), and(wrIsFall, bearish))

  if(any(equals(true))([ buySignal, sellSignal ])) {
    debug('dev')(`SIGNAL ${buySignal ? 'BUY' : 'SELL'} ${getCurr(close)}     ${new Date(getCurr(time)).toLocaleString()}     ${meanLast(obv)} ${getCurr(obv)}`)
  }

  // debug('dev')({
  //   t: new Date(),
  //   close: getCurr(close),
  //   macd5m: getCurr(macdShort),
  //   macd15m: getCurr(macdLong),
  //   wr: getCurr(wr),
  //   rsi: getCurr(rsi),
  //   stochrsi,
  //   wrIsFall,
  //   wrIsGrow,
  //   macdShortIsFall,
  //   macdLongIsFall,
  //   macdShortIsGrow,
  //   macdLongIsGrow,
  //   bullish,
  //   bearish,
  //   wrList: takeLast(3, wr)
  // })

  return sellSignal ? -1 : ( buySignal ? 1 : 0 )
}

export default makeAnalysis
