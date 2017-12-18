import { converge, identity, juxt, curry, invoker, constructN, ifElse, compose, is, nth } from 'ramda'
import { fromEvent, observe } from 'most'
import { Publisher } from 'cote'
import * as BFX from 'bitfinex-api-node'

const exitProcess = () => process.exit(1)
const getSymbol = () => process.env.PAIR || 'tBTCUSD'

// Constructors
const BFXConstruct: (key: any, secret: any, options: any) => typeof BFX = constructN(3, BFX)
const PublisherConstruct: (options: {}) => Publisher = constructN(1, Publisher)
const stream = curry((event: string, source: {}) => fromEvent(event, source))
const publishOf = curry((publisher: Publisher, key: string, value: any) => publisher.publish(key, value))

// Pure
const isShapshot = compose(is(Array), nth(0), nth(1))
const subscribeOrderBook = invoker(1, 'subscribeOrderBook')
const subscribeCandles = invoker(2, 'subscribeCandles')
const applySubscribers = curry((xs: any[], to: {}, _: any) => converge(identity, xs)(to))
const ready = stream('open')
const error = stream('error')
const candles = stream('candles')
const orderBook = stream('orderbook')
const streamsOf = juxt([ ready, error, candles, orderBook ])

// IO
const symbol = getSymbol()
const { ws } = BFXConstruct(null, null, { version: 2 })
const publisher = PublisherConstruct({ name: 'exchange publisher BTCUSD' })
const publish = publishOf(publisher)
const subscribers = [ subscribeOrderBook(symbol), subscribeCandles(symbol, '1m') ]
const [ readyStream, errorStream, candlesStream, orderbookStream ] = streamsOf(ws)

// Observables
observe(ifElse(isShapshot, publish('setCandles'), publish('updateCandle')), candlesStream)
observe(ifElse(isShapshot, publish('setOrderbook'), publish('updateOrderbook')), orderbookStream)
observe(applySubscribers(subscribers, ws), readyStream)
observe(exitProcess, errorStream)
