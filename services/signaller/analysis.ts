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
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles ]) => {
  const [ time, open, high, low, close ] = getCandlesParts(candles)

  const wr = williamsr({ period: 14, close, low, high })
  const wrIsDrop = wrDrop(wr)
  const wrIsUp = wrUp(wr)

  const buySignal = wrIsUp
  const sellSignal = wrIsDrop

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(time)).toLocaleString(),
  //   close: last(close),
  //   wrList: takeLast(3, wr)
  // })

  if(any(equals(true))([ buySignal, sellSignal ])) {
    // trottling
    if (equals(last(time), timeOfLastSignal)) return null
    else timeOfLastSignal = <number>last(time)

    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${last(close)}     ${new Date(last(time)).toLocaleString()}`)
    return { symbol, side: buySignal ? 'BUY' : 'SELL', price: last(close), time: new Date().getTime() }
  }
  return null
}

export default makeAnalysis
