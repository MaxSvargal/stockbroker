import { uncurryN, invoker, converge, compose, apply, nth, flip, o, prop, always, join, reduce, concat } from 'ramda'
import { fromEvent, observe } from 'most'
import { RedisClient } from 'redis'
import { Responder } from 'cote'

type storeGetAllRequest = { type: 'storeGetAll', key: string }
const hash = o(<(a: any[]) => storeGetAllRequest>prop('key'), nth(0))
const replyFn = o(flip, nth(1))

type Hvals = (a: string, b: Function, c: RedisClient) => void
const hvals: Hvals = invoker(2, 'hvals')

type OnRequest = <Stream>(req: [ storeGetAllRequest, (err: Error, res: any[]) => any ]) => void
const applyHvals: OnRequest = converge(hvals, [ hash, replyFn ])

type EventToRequest = (a: RedisClient) => (b: Event) => any
const eventToRequest: EventToRequest = flip(uncurryN(2, applyHvals))

type Main = (a: (a: Event) => void, b: RedisClient, c: Responder) => void
const main: Main = (exitProcess, redis, responder) => {
  const storeGetAllStream = fromEvent('storeGetAll', responder)
  observe(eventToRequest(redis), storeGetAllStream)
}

export default main
