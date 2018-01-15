import debug from 'debug'
import * as indicators from 'technicalindicators'
import {
  any, mean, compose, all, equals, and, not, range, converge,
  last, init, head, prop, lt, gt, o, juxt, map, nth, takeLast, both
} from 'ramda'

import stochRsi from './stochrsi'

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))
const getCurr = o(head, takeLast(1))
const getPrev = o(head, takeLast(2))
const macdHistogram = map(<any>prop('histogram'))
const wrCurrIsDrop = o(gt(-20), getCurr)
const wrPrevIsGreat = o(lt(-20), getPrev)
const wrCurrIsUp = o(lt(-80), getCurr)
const wrPrevIsLow = o(gt(-80), getPrev)
const wrDrop = both(wrCurrIsDrop, wrPrevIsGreat)
const wrUp = both(wrCurrIsUp, wrPrevIsLow)

const anyPairGrow = any(converge(lt, [ head, last ]))
const anyPairFall = any(converge(gt, [ head, last ]))
const checkCurrVsMeanGrow = compose(converge(lt, [ o(mean, init), last ]), takeLast(4))
const checkCurrVsMeanFall = compose(converge(gt, [ o(mean, init), last ]), takeLast(4))

type MakeAnalysis = (a: number[][][]) => {}
const makeAnalysis: MakeAnalysis = ([ candles1m, candles5m ]) => {
  const [ time, open, high, low, close, volume ] = getCandlesParts(candles1m)

  // TODO: every minute check 15m WR for up trend, on reverse trend to fall over -50, close positions and out there
  // then trend change to down, send signal to trade-master and exit process
  // event { type: signalPublishersWorkComplete, symbol }

  // const [ , , , , close5m, volume5m ] = getCandlesParts(candles5m)

  const wr = indicators.williamsr({ period: 7, close, low, high })
  // const macdShort = macdHistogram(indicators.macd(<any>{ values: close5m, fastPeriod: 9, slowPeriod: 14, signalPeriod: 7 }))
  // const obv = indicators.obv({ close: close5m, volume: volume5m })
  // const roc = indicators.roc({ period: 7, values: close5m })
  // const emaShort = indicators.ema({ period: 3, values: close5m })
  // const emaLong = indicators.ema({ period: 7, values: close5m })

  // TODO: Refactor this
  // const prevShortEma = getPrev(emaShort)
  // const currShortEma = getCurr(emaShort)
  // const prevLongEma = getPrev(emaLong)
  // const currLongEma = getCurr(emaLong)
  // const emaIsGrow = and(lt(prevShortEma, prevLongEma), gt(currShortEma, currLongEma))
  // const emaIsFall = not(emaIsGrow)
  //

  // const indicatorsList = [ macdShort, obv, roc, wr ]
  // const [ macdIsGrow, obvIsGrow, rocIsGrow, wrIsGrow ] = map(checkCurrVsMeanGrow, indicatorsList)
  // const [ macdIsFall, obvIsFall, rocIsFall, wrIsFall ] = map(checkCurrVsMeanFall, indicatorsList)

  const wrIsDrop = wrDrop(wr)
  const wrIsUp = wrUp(wr)

  const buySignal = all(equals(true), [ macdIsGrow, obvIsGrow, rocIsGrow, wrIsUp, emaIsGrow ])
  const sellSignal = all(equals(true), [ macdIsFall, obvIsFall, rocIsFall, wrIsDrop, emaIsFall ])

  if(any(equals(true))([ buySignal, sellSignal ])) {
    debug('dev')(`SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${getCurr(close).toFixed(8)}     ${new Date(getCurr(time)).toLocaleString()}`)
  }

  debug('dev')({
    now: new Date().toLocaleString(),
    t: new Date(getCurr(time)).toLocaleString(),
    close: getCurr(close),
    // macd5m: getCurr(macdShort),
    // wr: getCurr(wr),
    // macdIsGrow, obvIsGrow, rocIsGrow, wrIsGrow, wrIsUp, emaIsGrow,
    // macdIsFall, obvIsFall, rocIsFall, wrIsFall, wrIsDrop, emaIsFall,
    buySignal,
    sellSignal,
    wrList: takeLast(4, wr)
  })
  // TODO: send close price !!!!
  return sellSignal ? -1 : ( buySignal ? 1 : 0 )
}

export default makeAnalysis
