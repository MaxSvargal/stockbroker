import { __, o, not, when, isNil, assoc, invoker, flip, curry, map, compose, sortBy, nth, takeLast } from 'ramda'
import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'

import makeAnalysis from './analysis'

const candlesFrames = [ '1m' ]
const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')
const invokePublishNewSignal = flip(invokePublish('newSignal'))
const makeStoreGetAllRequest = assoc('key', __, { type: 'cacheHashGetValues' })
const makeCandlesKey = curry((symbol: string, time: string) => `candles:${time}:${symbol}`)
// TODO: rewrite makeRequests
const makeRequests = (symbol: string) => map(compose(makeStoreGetAllRequest, makeCandlesKey(symbol)))
const mapToFloat = o(map, map, parseFloat)

type ParseCandles = (a: string[]) => number[][]
const parseCandles: ParseCandles = compose(mapToFloat, takeLast(50), sortBy(nth(0)), map(JSON.parse))

type Main = (a: (a: Event) => void, b: Stream<{}>, c: Requester, d: Publisher, e: string) => void
const main: Main = (exitProcess, loopStream, requester, publisher, symbol) => {
  const send = invokeSend(requester)
  const publish = invokePublishNewSignal(publisher)
  const requests = makeRequests(symbol)(candlesFrames)
  const evalAnalysis = compose(when(o(not, isNil), publish), makeAnalysis, map(parseCandles))
  const tick = () => Promise.all(map(send, requests)).then(evalAnalysis).catch(exitProcess)

  observe(tick, loopStream)
}

export default main
