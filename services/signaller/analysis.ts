import log from '../utils/log'
import { williamsr, bollingerbands } from 'technicalindicators'
import {
  any, equals, range, head, lt, gt, o, juxt, map, nth, takeLast, both,
  last, not, and, converge, prop, reduce, min,
  divide, subtract, ifElse, pair
} from 'ramda'

let timeOfLastSignal = 0

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))
const getPrev = o(head, takeLast(2))
const wrCurrIsDrop = o(gt(-20), last)
const wrPrevIsGreat = o(lt(-20), getPrev)
const wrCurrIsUp = o(lt(-80), last)
const wrPrevIsLow = o(gt(-80), getPrev)
const wrDrop = both(wrCurrIsDrop, wrPrevIsGreat)
const wrUp = both(wrCurrIsUp, wrPrevIsLow)
const margin = converge(divide, [ converge(subtract, [ last, head ]), ifElse(converge(lt, [ head, last ]), head, last) ])

const getBBLastLower = o(prop('lower'), last)
const getBBLastUpper = o(prop('upper'), last)
const getLowestLow = o(reduce(min, Infinity), map(parseFloat))

type MakeAnalysis = (a: number[][][]) => { type: string, price: number, time: number }
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles5m ]) => {
  const [ timeShort, openShort, highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  const [ timeLong, openLong, highLong, lowLong, closeLong ] = getCandlesParts(candles5m)

  const bbShort = bollingerbands({ period: 20, stdDev: 2, values: map(parseFloat, closeShort) })
  const bbLong = bollingerbands({ period: 20, stdDev: 2, values: map(parseFloat, closeLong) })
  const wrShort = williamsr({ period: 14, close: closeShort, low: lowShort, high: highShort })
  const wrLong = williamsr({ period: 14, close: closeLong, low: lowLong, high: highLong })
  const lastPrice = last(closeShort)

  const buySignal = lastPrice < getBBLastLower(bbShort) && last(wrShort) < -80
  const sellSignal = lastPrice > getBBLastUpper(bbLong) && last(wrLong) > -20
  const riftPrice = getLowestLow(lowLong)
  const volatilityPerc = margin(o(converge(pair, [ prop('lower'), prop('upper') ]), last)(bbLong))

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(timeShort)).toLocaleString(),
  //   close: last(closeShort),
  //   wrList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong)
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
