import { __, apply, curry, compose, construct, prop, invoker, path, either, flip, identity, equals, nth, when, pipe, converge, reduce, filter, complement, cond, T, composeP, always, zipObj } from 'ramda'
import { createEpicWithState } from './utils'
import { ofType, ActionsObservable } from 'redux-observable'
import { Observable } from 'rxjs'
import { map, mergeMap, mapTo, last, switchMap, race, merge, catchError, every, flatMap, concat } from 'rxjs/operators'
import { SimpleActionCreator } from 'redux-act'
import { BFX } from 'bitfinex-api-node'

import {
  initialized, bitfinexConnect,
  bitfinexConnected, bitfinexRejected,
  bitfinexAuthorized, bitfinexAuthRejected,
  setWallet, updateWallet, setOrders, bitfinexHeartbeat, orderUpdate,
  execNewOrder, createPosition, updateMyTrade
} from 'shared/actions'

import { Action, NewOrderPayload, OrderData } from 'shared/types'

const Bfx = require('bitfinex-api-node')

const key = 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const secret = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'

const BfxConstructor = construct(Bfx)
const invokeAuth = invoker(0, 'auth')
const invokeSend = flip(invoker(1, 'send'))
const payloadProp = <any>prop('payload')
const spawnAction = curry((action: SimpleActionCreator<any, any>) =>
  compose(Observable.of, action))

const handleWsEvent = curry((eventName: string, ws: any) =>
  Observable.fromPromise(new Promise((res, rej) => {
    ws.on(eventName, () => res(ws))
    ws.on('error', (err: Error) => rej(err))
    ws.on('message', (message: any) => console.log({ message }))
    ws.on('os', (os: any) => console.log({ os }))
    ws.on('ou', (ou: any) => console.log({ ou }))
    ws.on('wu', (wu: any) => console.log({ wu }))
    ws.on('ws', (ws: any) => console.log({ ws }))
  })
))

const wsConnect = handleWsEvent('open')
const wsAuth = handleWsEvent('auth')

const responseKeyEq = curry((val: string) => compose(equals(val), nth(1)))
const responseData = curry((action: any) => compose(action, nth(2)))
const keyToAction = (key: string, action: SimpleActionCreator<any, any>) =>
  [ responseKeyEq(key), responseData(action) ]

const onMessageChannel = curry((ws: any) =>
  Observable.fromEvent(ws, 'message'))

const formatNewOrderRequest = ({ amount, price, symbol }: NewOrderPayload) => [
  0, 'on', null,
  {
    gid: 1,
    cid: null,
    type: 'EXCHANGE LIMIT',
    symbol: symbol,
    amount: `${amount}`,
    price: `${price}`,
    hidden: 0
  }
]

const orderSymbol = nth(3)
// export type OrderData = [ ID, GID, CID, SYMBOL, MTS_CREATE, MTS_UPDATE, AMOUNT, AMOUNT_ORIG, TYPE, TYPE_PREV, FLAGS, ORDER_STATUS, PRICE, PRICE_AVG, PRICE_TRAILING, PRICE_AUX_LIMIT, NOTIFY, HIDDEN, PLACED_ID ]







const sendNewOrderRequest = curry((ws: BFX, payload: NewOrderPayload) =>
  compose(
    always(payload),
    invokeSend(ws),
    formatNewOrderRequest
  )(payload))

const waitForNewTrade = curry((action$: ActionsObservable<Action>, orderPayload: NewOrderPayload) =>
  compose(
    map(createPosition),
    map(payloadProp),
    ofType(updateMyTrade)
  )(action$))

const waitForOrderUpdate = curry((action$: ActionsObservable<Action>, orderPayload: NewOrderPayload) =>
  compose(
    mergeMap(waitForNewTrade(action$)),
    map(payloadProp),
    ofType(orderUpdate)
  )(action$))

const waitForExecNewOrder = curry((action$: ActionsObservable<Action>, ws: BFX) =>
  compose(
    mergeMap(waitForOrderUpdate(action$)),
    map(sendNewOrderRequest(ws)),
    map(payloadProp),
    ofType(execNewOrder)
  )(action$))

export const newOrder = (action$: ActionsObservable<Action>) =>
  compose(
    flatMap(waitForExecNewOrder(action$)),
    map(payloadProp),
    ofType(bitfinexConnected)
  )(action$)







export const watchChannels = compose(
  flatMap(map(cond(<any>[
    keyToAction('ws', setWallet),
    keyToAction('wu', updateWallet),
    keyToAction('os', setOrders),
    keyToAction('ou', orderUpdate),
    [ T, responseData(bitfinexHeartbeat) ]
  ]))),
  map(onMessageChannel),
  map(<typeof bitfinexConnected>payloadProp),
  ofType(bitfinexConnected)
)

export const auth = compose(
  catchError(spawnAction(bitfinexAuthRejected)),
  map(bitfinexAuthorized),
  switchMap(wsAuth),
  map(either(<any>invokeAuth, identity)),
  map(<typeof bitfinexConnected>prop('payload')),
  ofType(bitfinexConnected)
)

export const connect = compose(
  catchError(spawnAction(bitfinexRejected)),
  map(bitfinexConnected),
  switchMap(wsConnect),
  map(<any>prop('ws')),
  mapTo(apply(BfxConstructor, [ key, secret, { version: 2 } ])),
  ofType(initialized)
)
