import debug from 'debug'
import { apply, converge, call, __, o, zipWith, map, applyTo, props, flip, invoker, assoc, curry, compose, nth, CurriedFunction6 } from 'ramda'
import { Stream, periodic, observe } from 'most'
import { Requester, Publisher } from 'cote'

type Candle = { openTime: number, open: string, close: string, high: string, low: string, volume: string }

type PublishOf = CurriedFunction6<string, any, string, string, string, any, void>
const publishOf: PublishOf = curry((event, publisher, key, symbol, frame, value) =>
  publisher.publish(event, [ `${key}:${frame}:${symbol}`, value ]))

const limit = 50
const candles = 'candles'
const candlesFrames = [ '1m', '5m', '15m' ]
const makeRequestOptions = curry((limit: number, symbol: string, interval: string) => ({ limit, symbol, interval }))
const requestCandles = flip(invoker(1, candles))
const candlesProps: (a: Candle) => any[] = props([ 'openTime', 'open', 'close', 'high', 'low', 'volume' ])
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

  const candlesRequests = map(getCandles, requestOptions)
  const candlesResponses = o(zipWith(setFrameValue, candlesFrames), formatCandles)

  const tick = () => Promise.all(candlesRequests).then(candlesResponses).catch(exitProcess)

  observe(tick, mainLoopStream)
}

export default main
