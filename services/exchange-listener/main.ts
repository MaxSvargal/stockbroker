import { converge, identity, juxt, curry, invoker, ifElse, compose, is, nth } from 'ramda'
import { fromEvent, observe } from 'most'
import { Publisher } from 'cote'

// Constructors
const stream = curry((event: string, source: {}) =>
  fromEvent(event, source))

const publishOf = curry((event: string, publisher: any, key: string, value: any) =>
  publisher.publish(event, [ `${key}:${nth(0, value)}`, nth(1, value) ]))

// Pure
const candles = 'candles'
const orderbook = 'orderbook'
const isShapshot = compose(is(Array), nth(0), nth(1))
const subscribeOrderBook = invoker(1, 'subscribeOrderBook')
const subscribeCandles = invoker(2, 'subscribeCandles')
const applySubscribers = curry((xs: any[], to: {}, _: any) => converge(identity, xs)(to))
const publishSet = publishOf('storeSet')
const publishUpdate = publishOf('storeUpdate')
const readyStream = stream('open')
const errorStream = stream('error')
const candlesStream = stream(candles)
const orderBookStream = stream(orderbook)
const streamsOf = juxt([ readyStream, errorStream, candlesStream, orderBookStream ])

type BWS = {}
type Main = (a: (a: Event) => void, b: BWS, c: Publisher, d: string) => void
const main: Main = (exitProcess, ws, publisher, symbol) => {
  const subscribers = [
    subscribeOrderBook(symbol),
    subscribeCandles(symbol, '1m'),
    subscribeCandles(symbol, '5m'),
    subscribeCandles(symbol, '15m')
  ]
  const [ readyStream, errorStream, candlesStream, orderbookStream ] = streamsOf(ws)
  const set = publishSet(publisher)
  const update = publishUpdate(publisher)

  observe(applySubscribers(subscribers, ws), readyStream)
  observe(ifElse(isShapshot, set(candles), update(candles)), candlesStream)
  observe(ifElse(isShapshot, set(orderbook), update(orderbook)), orderbookStream)
  observe(exitProcess, errorStream)
}

export default main
