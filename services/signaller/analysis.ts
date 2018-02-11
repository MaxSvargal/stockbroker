import log from '../utils/log'
import { williamsr } from 'technicalindicators'
import { any, equals, range, head, lt, gt, o, juxt, map, nth, takeLast, both, last } from 'ramda'

let timeOfLastSignal = 0

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))
const getPrev = o(head, takeLast(2))
const wrCurrIsDrop = o(gt(-20), last)
const wrPrevIsGreat = o(lt(-20), getPrev)
const wrCurrIsUp = o(lt(-80), last)
const wrPrevIsLow = o(gt(-80), getPrev)
const wrDrop = both(wrCurrIsDrop, wrPrevIsGreat)
const wrUp = both(wrCurrIsUp, wrPrevIsLow)

type MakeAnalysis = (a: number[][][]) => { type: string, price: number, time: number }
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m ]) => {
  const [ time, _, highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  // const [ __, ___, highLong, lowLong, closeLong ] = getCandlesParts(candles5m)

  const wrShort = williamsr({ period: 10, close: closeShort, low: lowShort, high: highShort })
  // const wrLong = williamsr({ period: 10, close: closeLong, low: lowLong, high: highLong })

  const buySignal = wrUp(wrShort)
  const sellSignal = wrDrop(wrShort)

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(closeShort)).toLocaleString(),
  //   close: last(closeShort),
  //   wrList: takeLast(3, wrShort)
  // })

  if(any(equals(true))([ buySignal, sellSignal ])) {
    // trottling
    if (equals(last(time), timeOfLastSignal)) return null
    else timeOfLastSignal = <number>last(time)

    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${last(closeShort)}     ${new Date(last(time)).toLocaleString()}`)
    return { symbol, side: buySignal ? 'BUY' : 'SELL', price: last(closeShort), time: new Date().getTime() }
  }

  return null
}

export default makeAnalysis
