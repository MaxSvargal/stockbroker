import debug from 'debug'
import { o, zipWith, map, props, flip, invoker, curry, juxt, nth, identity, compose, unnest } from 'ramda'
import { Stream, periodic, observe } from 'most'
import { Requester, Publisher } from 'cote'

const limit = 50
const candles = 'candles'
const candlesFrames = [ '1m' ]

const invokeSend = flip(invoker(1, 'send'))
const requestCandles = flip(invoker(1, candles))
const makeRequestOptions = curry((symbol: string, limit: number, interval: string) => ({ symbol, limit, interval }))

type Candle = { openTime: number, open: string, close: string, high: string, low: string, volume: string }
const candlesProps = props([ 'openTime', 'open', 'high', 'low', 'close', 'volume' ])
const filterCandleProps = <Candle>o(map, map, candlesProps)

const timeAsKey = juxt([ nth(0), identity ])
const convertValues = compose(<any>unnest, map(compose(map(JSON.stringify), timeAsKey, map(parseFloat))))

const optionsToStoreRequest = curry((key: string, symbol: string, frame: string, values: string[]) =>
  ({ type: 'cacheHashMultiSet', key: `${key}:${frame}:${symbol}`, values: convertValues(values) }))

const prepareRequestToStore = (symbol: string, frames: string[]) =>
  zipWith(optionsToStoreRequest(candles, symbol), frames)

type Binance = { candles: (a: string) => Promise<{}[]> }
type Symbol = string
type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: Binance, d: Requester, e: Symbol) => void

const main: Main = (exitProcess, mainLoopStream, binance, requester, symbol) => {
  const send = invokeSend(requester)
  const getCandles = requestCandles(binance)
  const requestOptions = map(makeRequestOptions(symbol, limit), candlesFrames)
  const requestsToStore = compose(map(send), prepareRequestToStore(symbol, candlesFrames), <any>filterCandleProps)

  const tick = () =>
    Promise.all(map(getCandles, requestOptions))
      .then(requestsToStore)
      .catch(exitProcess)

  observe(tick, mainLoopStream)
}

export default main
