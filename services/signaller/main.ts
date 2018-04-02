import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import { curry, flip, invoker, isNil, map, not, o, when, applyTo } from 'ramda'

import makeAnalysis from './analysis'

const limit = 28
const candlesFrames = [ '5m', '15m' ]
const requestGetEnabledSymbols = {
  type: 'dbFilterAllRowsConcat',
  table: 'symbolsState',
  filter: { '4h': true, '1h': true, '15m': true },
  row: 'symbol',
}

const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')
const invokePublishNewSignal = flip(invokePublish('newSignal'))

const makeGetCandles = curry((fetch: Function, limit: number, interval: string, symbol: string) =>
  fetch(`https://binance.com/api/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
    .then((res: Response) => res.json())
    .catch((err: Error) => console.error(err)))

type Binance = { candles: (a: string) => Promise<{}[]> }
type Symbol = string
type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: Requester, d: Publisher, e: Function) => void

const main: Main = (exitProcess, mainLoopStream, requester, publisher, fetch) => {
  const publish = invokePublishNewSignal(publisher)
  const candlesRequestsForSymbols = map(makeGetCandles(fetch, limit), candlesFrames)
  const evalAnalysis = curry((symbol, candles) => o(when(o(not, isNil), publish), makeAnalysis(symbol), candles))

  const startAnalysisForSymbol = (symbol: string) =>
    Promise.all(map(applyTo(symbol), candlesRequestsForSymbols))
      .then(evalAnalysis(symbol))

  const startAnalysis = () =>
    invokeSend(requester)(requestGetEnabledSymbols)
      .then(map(startAnalysisForSymbol))
      .catch(exitProcess)

  observe(startAnalysis, mainLoopStream)
}

export default main
