import log from '../utils/log'
import { williamsr, bollingerbands, ema } from 'technicalindicators'
import {
  any, equals, range, head, lt, o, juxt, map, nth, takeLast, last, converge, gt, when, compose,
  prop, reduce, min, divide, subtract, ifElse, mean, unapply, allPass, always, multiply, objOf, assoc
} from 'ramda'

let timeOfLastSignal = 0

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))

const prev = <any>o(head, takeLast(2))
const bbProp = <any>prop('bb')
const wrProp = <any>prop('wr')
const lowerProp = <any>prop('middle')
const upperProp = <any>prop('upper')
const getLowestLow = o(<() => number>reduce(min, Infinity), map(parseFloat))
const calcEMA = compose(last, ema, assoc('period', 7), objOf('values'))
// TODO move to account
const getVolatilityPerc = o(
  when(gt(0.007), always(0.007)),
  converge(divide, [
    converge(subtract, [ last, head ]),
    converge(multiply, [
      ifElse(converge(lt, [ head, last ]), head, last),
      always(2)
    ])
  ])
)
const buyPass = allPass([
  converge(lt, [ prop('low'), compose(lowerProp, last, bbProp) ]),
  converge(lt, [ o(calcEMA, wrProp), o(last, wrProp) ]),
  // converge(lt, [ o(prev, wrProp), always(-80) ]),
  // converge(gt, [ o(last, wrProp), always(-80) ])
])
const sellPass = allPass([
  converge(gt, [ prop('high'), compose(upperProp, last, bbProp) ]),
  converge(gt, [ o(prev, wrProp), o(last, wrProp) ])
])

type MakeAnalysis = (a: string) => (xs: number[][][]) => { symbol: string, side: string, volatilityPerc: number, price: number, time: number } | null
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles5m ]) => {
  const [ timeShort, openShort, highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  const [ timeLong, openLong, highLong, lowLong, closeLong ] = getCandlesParts(candles5m)

  const bbShort = bollingerbands({ period: 21, stdDev: 2, values: map(parseFloat, closeShort) })
  const bbLong = bollingerbands({ period: 21, stdDev: 2, values: map(parseFloat, closeLong) })
  const wrShort = williamsr({ period: 14, close: closeShort, low: lowShort, high: highShort })
  const wrLong = williamsr({ period: 14, close: closeLong, low: lowLong, high: highLong })
  const lastPrice = o(parseFloat, last, closeShort)

  const buySignal = buyPass({ low: last(lowShort), bb: bbShort, wr: wrShort })
  const sellSignal = sellPass({ high: last(highLong), bb: bbLong, wr: wrLong })
  const volatilityPerc = getVolatilityPerc([ lastPrice, o(upperProp, last, bbLong) ])

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(timeShort)).toLocaleString(),
  //   close: last(closeShort),
  //   wrShortList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong),
  //   bbLong: last(bbShort),
  //   volatilityPerc
  // })

  if(any(equals(true))([ buySignal, sellSignal ])) {
    // trottling
    if (equals(last(timeLong), timeOfLastSignal)) return null
    else timeOfLastSignal = <number>last(timeLong)

    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${last(closeShort)}     ${new Date(last(timeShort)).toLocaleString()}`)
    return { symbol, volatilityPerc, side: buySignal ? 'BUY' : 'SELL', price: <number>last(closeShort), time: new Date().getTime() }
  }
  return null
}

export default makeAnalysis
