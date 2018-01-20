import { uncurryN, invoker, converge, applyTo, compose, apply, nth, flip, o, prop, always, join, reduce, concat } from 'ramda'
import { fromEvent, observe } from 'most'
import { RedisClient } from 'redis'
import { Responder } from 'cote'

type storeGetAllRequest = { type: 'cacheHashGetValues', key: string, field?: string }
const key = o(<(a: any[]) => storeGetAllRequest>prop('key'), nth(0))
const field = o(<(a: any[]) => storeGetAllRequest>prop('field'), nth(0))
const replyFn = nth(1)

type Hvals = (a: string, b: Function, c: RedisClient) => void
const hvals: Hvals = invoker(2, 'hvals')
const hget: Hvals = invoker(3, 'hget')

type OnRequest = <Stream>(req: [ storeGetAllRequest, (err: Error, res: any[]) => any ]) => void
const applyHvals: OnRequest = converge(hvals, [ key, replyFn ])
const applyHget: OnRequest = converge(hget, [ key, field, replyFn ])

type EventToRequest = (a: RedisClient) => (b: Event) => any
const eventHValuesToRequest: EventToRequest = flip(uncurryN(2, applyHvals))
const eventHGetToRequest: EventToRequest = flip(uncurryN(2, applyHget))

type Main = (a: (a: Event) => void, b: RedisClient, c: Responder) => void
const main: Main = (exitProcess, redis, responder) => {
  observe(eventHValuesToRequest(redis), fromEvent('cacheHashGetValues', responder))
  observe(eventHGetToRequest(redis), fromEvent('cacheHashGet', responder))
}

export default main
