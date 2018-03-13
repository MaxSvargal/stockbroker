import { any, equals, range, head, lt, o, juxt, map, nth, takeLast, last, gt, both, compose, apply, zip } from 'ramda'
import { williamsr, ema } from 'technicalindicators'
import log from '../utils/log'

const getCandlesParts: (a: any[][]) => number[][] = juxt(<any>map(o(map, nth), range(0, 6)))

const prev = <any>o(head, takeLast(2))
const buyPass = both(o(gt(-80), prev), o(lt(-80), last))
const sellPass = both(o(lt(-20), prev), o(gt(-20), last))
const mParseFloat = map(parseFloat)
const emaIsCross = compose(both(o(apply(lt), last), o(apply(gt), head)), <any>apply(zip), map(takeLast(2)))

type MakeAnalysis = (a: string) => (xs: number[][][]) => { symbol: string, side: string, volatilityPerc: number, price: number, time: number } | null
const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles5m, candles1h ]) => {
  const [ timeShort, openShort, highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  const [ timeLong, openLong, highLong, lowLong, closeLong ] = getCandlesParts(candles5m)
  const [ , , , , closeVLong ] = getCandlesParts(candles1h)

  const wrShort = williamsr({ period: 21, close: closeShort, low: lowShort, high: highShort })
  const wrLong = williamsr({ period: 30, close: closeLong, low: lowLong, high: highLong })
  const emaShort = ema({ period: 7, values: mParseFloat(closeVLong) })
  const emaLong = ema({ period: 25 , values: mParseFloat(closeVLong) })
  const lastPrice = o(parseFloat, last, closeShort)

  const buySignal = buyPass(wrShort)
  const sellSignal = sellPass(wrLong)
  const forcedSellSignal = emaIsCross([ emaShort, emaLong ])

  // log({
  //   now: new Date().toLocaleString(),
  //   t: new Date(last(timeShort)).toLocaleString(),
  //   close: last(closeShort),
  //   wrShortList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong)
  // })

  if(any(equals(true))([ buySignal, sellSignal, forcedSellSignal ])) {
    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${lastPrice}     ${new Date(last(timeShort)).toLocaleString()}`)
    return {
      symbol,
      side: buySignal ? 'BUY' : 'SELL',
      price: lastPrice,
      time: new Date().getTime(),
      forced: forcedSellSignal
    }
  }

  return null
}

export default makeAnalysis
