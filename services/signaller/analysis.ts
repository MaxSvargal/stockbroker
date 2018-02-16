import log from '../utils/log'
import { williamsr, bollingerbands } from 'technicalindicators'
import {
  any, equals, range, head, lt, o, juxt, map, nth, takeLast, last, converge, gt,
  prop, reduce, min, divide, subtract, ifElse, mean, unapply, allPass, always, multiply
} from 'ramda'

let timeOfLastSignal = 0

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))

const prev = o(head, takeLast(2))
const getBBLastLower = o(prop('lower'), last)
const getBBLastUpper = o(prop('upper'), last)
const getLowestLow = o(reduce(min, Infinity), map(parseFloat))

const margin = converge(divide, [ converge(subtract, [ last, head ]), ifElse(converge(lt, [ head, last ]), head, last) ])
const marginBBProps = converge(unapply(margin), [ prop('middle'), prop('upper') ])
const meanMargin = o(mean, map(marginBBProps))
const decreaseMeanMarginOnPb = converge(multiply, [ meanMargin, o(prop('pb'), last) ])

const buyPass = allPass([
  converge(lt, [ prop('low'), o(getBBLastLower, prop('bb')) ]),
  converge(lt, [ o(prev, prop('wr')), o(last, prop('wr')) ]),
  converge(lt, [ o(prev, prop('wr')), always(-80) ]),
  converge(gt, [ o(last, prop('wr')), always(-80) ])
])
const sellPass = allPass([
  converge(gt, [ prop('high'), o(getBBLastUpper, prop('bb')) ]),
  converge(gt, [ o(prev, prop('wr')), o(last, prop('wr')) ]),
  converge(gt, [ o(prev, prop('wr')), always(-20) ]),
  converge(lt, [ o(last, prop('wr')), always(-20) ])
])

type MakeAnalysis = (a: number[][][]) => { type: string, price: number, time: number }
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles5m ]) => {
  const [ timeShort, openShort, highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  const [ timeLong, openLong, highLong, lowLong, closeLong ] = getCandlesParts(candles5m)

  const bbShort = bollingerbands({ period: 20, stdDev: 2, values: map(parseFloat, closeShort) })
  const bbLong = bollingerbands({ period: 20, stdDev: 2, values: map(parseFloat, closeLong) })
  const wrShort = williamsr({ period: 14, close: closeShort, low: lowShort, high: highShort })
  const wrLong = williamsr({ period: 14, close: closeLong, low: lowLong, high: highLong })
  const lastPrice = last(closeShort)

  const buySignal = buyPass({ low: last(lowLong), bb: bbShort, wr: wrShort })
  const sellSignal = sellPass({ high: last(highLong), bb: bbLong, wr: wrLong })
  const riftPrice = getLowestLow(lowLong)
  const volatilityPerc = decreaseMeanMarginOnPb(bbLong)

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(timeShort)).toLocaleString(),
  //   close: last(closeShort),
  //   wrShortList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong),
  //   riftPrice,
  //   volatilityPerc
  // })

  if(any(equals(true))([ buySignal, sellSignal ])) {
    // trottling
    if (equals(last(timeLong), timeOfLastSignal)) return null
    else timeOfLastSignal = <number>last(timeLong)

    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${last(closeShort)}     ${new Date(last(timeShort)).toLocaleString()}`)
    return { symbol, riftPrice, volatilityPerc, side: buySignal ? 'BUY' : 'SELL', price: last(closeShort), time: new Date().getTime() }
  }
  return null
}

export default makeAnalysis
