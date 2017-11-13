import { __, apply, curry, compose, construct, prop, invoker, path, either, flip, identity } from 'ramda'
import { createEpicWithState } from './utils'
import { ofType } from 'redux-observable'
import { Observable } from 'rxjs'
import { map, mapTo, last, flatMap, race, merge } from 'rxjs/operators'
import { SimpleActionCreator } from 'redux-act'

import { bitfinexConnect, bitfinexConnected, bitfinexRejected, bitfinexAuthorized } from 'shared/actions'

const BFX = require('bitfinex-api-node')

const wsOpen = curry((ws: any) => Observable.fromEvent(ws, 'open'))
const wsError = curry((ws: any) => Observable.fromEvent(ws, 'error'))
const wsAuth = curry((ws: any) => Observable.fromEvent(ws, 'auth'))

const key = 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const secret = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'
const BfxConstructor = construct(BFX)
const invokeAuth = <typeof BFX>invoker(0, 'auth')

export const auth = compose(
  mapTo(bitfinexAuthorized()),
  flatMap(wsAuth),
  map(either(invokeAuth, identity)),
  map(<typeof bitfinexConnected>prop('payload')),
  ofType(bitfinexConnected)
)

export const connect = createEpicWithState(fromState =>
  compose(
    map(bitfinexConnected),
    flatMap((ws) => wsOpen(ws).mapTo(ws)),
    map(<typeof BFX>prop('ws')),
    mapTo(apply(BfxConstructor, [ key, secret, { version: 2 } ])),
    ofType('SET_ACCOUNT')
  )
)
