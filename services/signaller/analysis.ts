import {
  any, both, equals, gt, head, juxt, last, lt, map, nth, o, range, takeLast,
} from 'ramda'
import { williamsr } from 'technicalindicators'

import log from '../utils/log'

const getCandlesParts: (a: any[][]) => number[][] =
  juxt(map(o(map as any, nth), range(0, 6)) as any)

const prev = o(head, takeLast(2))
const buyPass = both(o(gt(-80), prev), o(lt(-80), last))
const sellPass = both(o(lt(-20), prev), o(gt(-20), last))

type MakeAnalysis = (a: string) => (xs: number[][][]) =>
  { symbol: string, side: string, price: number, time: number } | null

const makeAnalysis: MakeAnalysis = (symbol: string) => ([ candles1m, candles5m, candles2h ]) => {
  const [ , , highShort, lowShort, closeShort ] = getCandlesParts(candles1m)
  const [ , , highLong, lowLong, closeLong ] = getCandlesParts(candles5m)
  const [ , , highVLong, lowVLong, closeVLong ] = getCandlesParts(candles2h)

  const wrShort = williamsr({ period: 14, close: closeShort, low: lowShort, high: highShort })
  const wrLong = williamsr({ period: 14, close: closeLong, low: lowLong, high: highLong })
  const wrVLong = williamsr({ period: 28, close: closeVLong, low: lowVLong, high: highVLong })
  const lastPrice = o(parseFloat, last, closeShort)

  const buySignal = buyPass(wrShort)
  const sellSignal = sellPass(wrLong)
  // const forcedSellSignal = sellPass(wrVLong)

  // если курс пересёк минимальный профит сверху-вниз, то продавать по цене минимального профита

  // log({
  //   now: new Date().toLocaleString(),
  //   close: last(closeShort),
  //   wrShortList: takeLast(3, wrShort),
  //   wrLongList: takeLast(3, wrLong)
  // })

  if (any(equals(true))([ buySignal, sellSignal, forcedSellSignal ])) {
    log(`${symbol} SIG ${buySignal ? '🚀  BUY' : '🏁  SEL'} ${lastPrice} }`)
    return {
      symbol,
      side: buySignal ? 'BUY' : 'SELL',
      price: lastPrice,
      time: new Date().getTime(),
      forced: forcedSellSignal,
    }
  }

  return null
}

export default makeAnalysis
