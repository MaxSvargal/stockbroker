import debug from 'debug'
import { williamsr } from 'technicalindicators'
import { any, equals, range, head, lt, gt, o, juxt, map, nth, takeLast, both, last } from 'ramda'

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
  const [ time, open, high, low, close, volume ] = getCandlesParts(candles1m)

  const wr = williamsr({ period: 7, close, low, high })
  const wrIsDrop = wrDrop(wr)
  const wrIsUp = wrUp(wr)

  const buySignal = wrIsUp
  const sellSignal = wrIsDrop

  // debug('dev')({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(time)).toLocaleString(),
  //   close: last(close),
  //   buySignal,
  //   sellSignal,
  //   wrList: takeLast(4, wr)
  // })

  if(any(equals(true))([ buySignal, sellSignal ])) {
    debug('dev')(`SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${last(close).toFixed(8)}     ${new Date(last(time)).toLocaleString()}`)
    return { symbol, type: buySignal ? 'BUY' : 'SELL', price: last(close), time: new Date().getTime() }
  }
  return null
}

export default makeAnalysis
