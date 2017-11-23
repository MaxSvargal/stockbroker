import { constructN, compose, apply, prop, curry, cond, equals, nth, invoker, either, identity, converge, T, is, ifElse } from 'ramda'
import { map, mapTo, switchMap, catchError, flatMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ofType, ActionsObservable } from 'redux-observable'
import { SimpleActionCreator } from 'redux-act'
import {
  initialized, bitfinexConnected, bitfinexRejected,
  bitfinexSubscribed, bitfinexHeartbeat,
  setCandles, updateCandle, updateTicker,
  setOrderBook, updateOrderBook
} from 'shared/actions'

import { CandlePayload } from 'shared/types'

export const payloadProp = <any>prop('payload')
export const payloadOfType = (...keys: any[]) => (action$: Observable<Action>) =>
  compose(map(payloadProp), ofType(...keys))(action$)
const responseKeyEq = (val: string) => compose(equals(val), nth(1))
const responseData = (action: any) => compose(action, nth(2))
const keyToAction = (key: string, action: SimpleActionCreator<any, any>) => [ responseKeyEq(key), responseData(action) ]
const orderbookChannel = (ws: any) => Observable.fromEvent(ws, 'orderbook', (chan, msg) => msg)
const tickerChannel = (ws: any) => Observable.fromEvent(ws, 'ticker', (chan, msg) => msg)
const candlesChannel = (ws: any) => Observable.fromEvent(ws, 'candles', (chan, msg) => [ chan, msg ])
const invokeSubscribeOrderBook: any = invoker(1, 'subscribeOrderBook')
const invokeSubscribeTicker: any = invoker(1, 'subscribeTicker')
const invokeSubscribeCandles: any = invoker(2, 'subscribeCandles')
const pairToSymbol = (pair: string) => `t${pair}`

const Bfx = require('bitfinex-api-node')
const BfxConstructor = constructN(3, Bfx)
const spawnAction = (action: SimpleActionCreator<any, any>) => compose(Observable.of, action)
const handleWsEvent = curry((eventName: string, ws: any) =>
  Observable.fromPromise(new Promise((res, rej) => {
    ws.on(eventName, () => res(ws))
    ws.on('error', (err: Error) => rej(err))
  })
))

export const connect = compose(
  catchError(spawnAction(bitfinexRejected)),
  map(bitfinexConnected),
  switchMap(handleWsEvent('open')),
  map(prop<string>('ws')),
  mapTo(apply(BfxConstructor, [ null, null, { version: 2 } ])),
  ofType(initialized)
)

export const subscribeToChannels = (symbol: string) => compose(
  mapTo(bitfinexSubscribed()),
  map(converge(identity, [
    invokeSubscribeOrderBook(symbol),
    invokeSubscribeTicker(symbol),
    invokeSubscribeCandles(symbol, '1m'),
    invokeSubscribeCandles(symbol, '30m')
  ])),
  payloadOfType(bitfinexConnected)
)

export const watchTickerChannel = compose(
  map(updateTicker),
  switchMap(tickerChannel),
  payloadOfType(bitfinexConnected)
)

export const watchOrderbookChannel = compose(
  map(ifElse(compose(is(Array), nth(0)), setOrderBook, updateOrderBook)),
  switchMap(orderbookChannel),
  payloadOfType(bitfinexConnected)
)

export const watchCandlesChannel = compose(
  map(ifElse(compose(is(Array), nth(0), nth(1)), setCandles, updateCandle)),
  switchMap(candlesChannel),
  payloadOfType(bitfinexConnected)
)
