import debug from 'debug'
import { o, zipWith, map, props, flip, invoker, curry } from 'ramda'
import { Stream, periodic, observe } from 'most'
import { Requester, Publisher } from 'cote'

type Candle = { openTime: number, open: string, close: string, high: string, low: string, volume: string }

const publishOf = curry((event: string, publisher: Publisher, key: string, symbol: string, frame: string, value: any) =>
  publisher.publish(event, <any>[ `${key}:${frame}:${symbol}`, value ]))

const limit = 50
const candles = 'candles'
const candlesFrames = [ '1m', '5m', '15m' ]
const makeRequestOptions = curry((limit: number, symbol: string, interval: string) => ({ limit, symbol, interval }))
const requestCandles = flip(invoker(1, candles))
const candlesProps: (a: Candle) => any[] = props([ 'openTime', 'open', 'high', 'low', 'close', 'volume' ])
const formatCandles = o(map, map, candlesProps)
const publishSet = publishOf('storeSet')

type Binance = { candles: (a: string) => any }
type Symbol = string
type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: Binance, d: Publisher, e: Symbol) => void

const main: Main = (exitProcess, mainLoopStream, binance, publisher, symbol) => {
  const getCandles = requestCandles(binance)
  const setFrameValue = publishSet(publisher, candles, symbol)
  const requestOptions = map(makeRequestOptions(limit, symbol), candlesFrames)
  const candlesResponses = o(zipWith(setFrameValue, candlesFrames), formatCandles)

  const tick = () =>
    Promise.all(map(getCandles, requestOptions))
      .then(candlesResponses)
      .catch(exitProcess)

  observe(tick, mainLoopStream)
}

export default main
