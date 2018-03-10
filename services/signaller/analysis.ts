import { any, equals, range, head, lt, o, juxt, map, nth, takeLast, last, gt, both } from 'ramda'
import { williamsr } from 'technicalindicators'
import log from '../utils/log'

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))

const prev = <any>o(head, takeLast(2))
const buyPass = both(o(gt(-80), prev), o(lt(-80), last))
const sellPass = both(o(lt(-20), prev), o(gt(-20), last))

type MakeAnalysis = (a: string) => (xs: number[][][]) => { symbol: string, side: string, volatilityPerc: number, price: number, time: number } | null
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles5m ]) => {
  const [ timeShort, openShort, highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  const [ timeLong, openLong, highLong, lowLong, closeLong ] = getCandlesParts(candles5m)

  const wrShort = williamsr({ period: 21, close: closeShort, low: lowShort, high: highShort })
  const wrLong = williamsr({ period: 58, close: closeLong, low: lowLong, high: highLong })
  const lastPrice = o(parseFloat, last, closeShort)

  const buySignal = buyPass(wrShort)
  const sellSignal = sellPass(wrLong)

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(timeShort)).toLocaleString(),
  //   close: last(closeShort),
  //   wrShortList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong)
  // })

  if(any(equals(true))([ buySignal, sellSignal ])) {
    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${lastPrice}     ${new Date(last(timeShort)).toLocaleString()}`)
    return { symbol, volatilityPerc: 0, side: buySignal ? 'BUY' : 'SELL', price: lastPrice, time: new Date().getTime() }
  }

  return null
}

export default makeAnalysis
