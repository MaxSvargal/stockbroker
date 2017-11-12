import { __, apply, curry, compose, construct, prop, invoker, path, chain } from 'ramda'
import { createEpicWithState } from './utils'
import { ofType } from 'redux-observable'
import { Observable } from 'rxjs'
import { map, mapTo, last, flatMap, race, merge } from 'rxjs/operators'

import { bitfinexConnect, bitfinexConnected, bitfinexRejected, bitfinexAuthorized } from 'shared/actions'

const BFX = require('bitfinex-api-node')

const wsOpen = curry((ws: any) => Observable.fromEvent(ws, 'open'))
const wsError = curry((ws: any) => Observable.fromEvent(ws, 'error'))
const wsAuth = curry((ws: any) => Observable.fromEvent(ws, 'auth'))

const key = '!o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const secret = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'
const BfxConstructor = construct(BFX)
const invokeAuth = <any>curry(invoker(__, 'auth'))

// export const subscribe =

export const auth = compose(
  mapTo(bitfinexAuthorized()),
  flatMap(wsAuth),
  map((ws: any) => ws.auth() || ws),
  map(path([ 'payload' ])),
  ofType(bitfinexConnected)
)

export const connect = createEpicWithState(fromState =>
  compose(
    map(bitfinexConnected),
    flatMap((ws) => wsOpen(ws).mapTo(ws)),
    map(prop('ws')),
    mapTo(apply(BfxConstructor, [ key, secret, { version: 2 } ])),
    ofType('SET_ACCOUNT')
  )
)
