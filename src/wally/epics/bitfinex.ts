import { Observable } from 'rxjs'
import { ofType, ActionsObservable } from 'redux-observable'
import { SimpleActionCreator } from 'redux-act'
import { BFX } from 'bitfinex-api-node'
import { Action, NewOrderPayload, OrderData } from 'shared/types'

import { checkOrderAvaliable, formatNewPosition, OrderResponse } from './positions'
import { createEpicWithState, payloadOfType } from './utils'

import {
  __, apply, curry, compose, constructN, prop, invoker, either, flip, identity,
  equals, nth, cond, T, pipe, always, and, propEq, allPass, applyTo, map as rmap,
  gt, not, isNil, ifElse, path, pathEq
} from 'ramda'

import {
  map, mergeMap, mapTo, switchMap, catchError, flatMap, timeout,
  timeoutWith, delay, takeUntil, filter, first, partition
} from 'rxjs/operators'

import {
  initialized, bitfinexHeartbeat,
  bitfinexConnected, bitfinexRejected,
  bitfinexAuthorized, bitfinexAuthRejected,
  setWallet, updateWallet, setOrders, orderUpdate,
  execNewOrder, orderCancel, createPosition, updateMyTrade,
  signalRequest, signalRequestResolved, signalRequestRejected
} from 'shared/actions'

const Bfx = require('bitfinex-api-node')
const key = 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const secret = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'

const BfxConstructor = constructN(3, Bfx)
const invokeAuth: any = invoker(0, 'auth')
const invokeSend = flip(invoker(1, 'send'))
const orderSymbol = nth(3)
const spawnAction = (action: SimpleActionCreator<any, any>) => compose(Observable.of, action)
const responseKeyEq = (val: string) => compose(equals(val), nth(1))
const responseData = (action: any) => compose(action, nth(2))
const keyToAction = (key: string, action: SimpleActionCreator<any, any>) => [ responseKeyEq(key), responseData(action) ]
const onMessageChannel = (ws: any) => Observable.fromEvent(ws, 'message')
const createComposeActions = ($: ActionsObservable<Action>) => (...args: Function[]) => compose(any => any, ...args)($)
const proxyPayload = curry((req: any, res: any) => [ req, res ])

const pairToSymbol = (pair: string) => `t${pair}`
const symbolEquals = compose(<any>propEq('symbol'), pairToSymbol, nth(1, <any>__))
const amountEquals = compose(<any>pathEq([ 'meta', 'amount' ]), nth(3, <any>__))
const priceEquals = compose(<any>pathEq([ 'meta', 'price' ]), nth(6, <any>__))
const allEquals = [ symbolEquals, amountEquals, priceEquals ]
const mapApplyTo: Function = compose(rmap, applyTo)
const checkOrderEqualsRequest = curry((req: typeof execNewOrder, res: NewOrderPayload) =>
  allPass(mapApplyTo(res)(allEquals))(req))

const handleWsEvent = curry((eventName: string, ws: any) =>
  Observable.fromPromise(new Promise((res, rej) => {
    ws.on(eventName, () => res(ws))
    ws.on('error', (err: Error) => rej(err))
  })
))

const formatNewOrderRequest = ({ symbol, meta: { amount, price } }: any) => [
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

const checkTradeEqualsOrder = curry((orderPayload: any, tradePaylaod: any) =>
  equals(nth(0, orderPayload), nth(4, tradePaylaod)))

export const newOrder = pipe(createComposeActions, (composeActions: Function) =>
  composeActions(
    catchError(spawnAction(bitfinexRejected)),
    mergeMap(([ requestPayload, orderPayload ]) =>
      composeActions(
        map(createPosition),
        map(formatNewPosition(requestPayload, orderPayload)),
        // TODO: change to filter and merge multiple trades
        first(checkTradeEqualsOrder(orderPayload)),
        payloadOfType(updateMyTrade)
      )
    ),
    mergeMap((requestPayload: any) =>
      composeActions(
        map(proxyPayload(requestPayload)),
        first(checkOrderEqualsRequest(requestPayload)),
        payloadOfType(orderCancel),
      )
    ),
    switchMap((ws: BFX) =>
      composeActions(
        // TODO: bump order in order book
        // OR: pass CID ???
        map(either(<any>compose(invokeSend(ws), formatNewOrderRequest), identity)),
        payloadOfType(signalRequestResolved)
      )
    ),
    payloadOfType(bitfinexConnected)
  )
)

export const resolveOrderRequest = createEpicWithState(fromStore =>
  compose(
    map(ifElse(<() => boolean>path([ 'meta', 'status' ]), signalRequestResolved, signalRequestRejected)),
    map(<() => OrderResponse>checkOrderAvaliable(fromStore)),
    payloadOfType(signalRequest)
  )
)

export const watchChannels = compose(
  flatMap(map(cond(<any>[
    keyToAction('ws', setWallet),
    keyToAction('wu', updateWallet),
    keyToAction('os', setOrders),
    keyToAction('oc', orderCancel),
    keyToAction('ou', orderUpdate),
    keyToAction('tu', updateMyTrade),
    [ T, responseData(bitfinexHeartbeat) ]
  ]))),
  map(onMessageChannel),
  payloadOfType(bitfinexConnected)
)

export const auth = compose(
  catchError(spawnAction(bitfinexAuthRejected)),
  map(bitfinexAuthorized),
  switchMap(handleWsEvent('auth')),
  map(either(invokeAuth, identity)),
  payloadOfType(bitfinexConnected)
)

export const connect = compose(
  catchError(spawnAction(bitfinexRejected)),
  map(bitfinexConnected),
  switchMap(handleWsEvent('open')),
  map(prop<string>('ws')),
  mapTo(apply(BfxConstructor, [ key, secret, { version: 2 } ])),
  ofType(initialized)
)
