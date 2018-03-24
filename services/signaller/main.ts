import { Publisher } from 'cote'
import { observe, Stream } from 'most'
import { compose, curry, flip, invoker, isNil, map, not, o, props, when } from 'ramda'

import makeAnalysis from './analysis'

const limit = 36
const candlesFrames = [ '1m', '5m' ]

const invokePublish = invoker(2, 'publish')
const invokePublishNewSignal = flip(invokePublish('newSignal'))
const requestCandles = flip(invoker(1, 'candles'))
const makeRequestOptions = curry((symbol: string, limit: number, interval: string) => ({ symbol, limit, interval }))

type Candle = { openTime: number, open: string, close: string, high: string, low: string, volume: string }
const candlesProps = props([ 'openTime', 'open', 'high', 'low', 'close', 'volume' ])
const filterCandleProps = <Candle>o(map, map, candlesProps)

type Binance = { candles: (a: string) => Promise<{}[]> }
type Symbol = string
type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: Binance, d: Publisher, e: Symbol) => void

const main: Main = (exitProcess, mainLoopStream, binance, publisher, symbol) => {
  // TODO use fetch instead?
  const publish = invokePublishNewSignal(publisher)
  const getCandles = requestCandles(binance)
  const requestOptions = map(makeRequestOptions(symbol, limit), candlesFrames)
  const evalAnalysis = compose(when(o(not, isNil), publish), makeAnalysis(symbol), filterCandleProps)

  const tick = () =>
    Promise.all(map(getCandles, requestOptions))
      .then(evalAnalysis)
      .catch(exitProcess)

  observe(tick, mainLoopStream)
}

export default main
