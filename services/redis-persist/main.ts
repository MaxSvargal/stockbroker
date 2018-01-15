import { curry, o, apply, juxt, identity, unnest, uncurryN, flip, compose, map, nth, invoker, converge, CurriedFunction2 } from 'ramda'
import { fromEvent, observe, Stream } from 'most'
import { RedisClient } from 'redis'
import { Subscriber } from 'cote'

const invokeHset = invoker(4, 'hset')
const invokeHmset = invoker(3, 'hmset')

type HashSetRequest = [ { key: string, field: string, value: string }, (err: Error, res: string) => void ]
const evalCacheHashSet = curry((redis: RedisClient, [ { key, field, value }, resp ]: HashSetRequest) =>
  apply(invokeHset)([ key, field, value, resp, redis ]))

type HashMultiSetRequest = [ { key: string, values: string[] }, (err: Error, res: string) => void ]
const evalCacheHashMultiSet = curry((redis: RedisClient, [ { key, values }, resp ]: HashMultiSetRequest) =>
  apply(invokeHmset)([ key, values, resp, redis ]))

type Main = (a: (a: Event) => void, b: RedisClient, c: Subscriber) => void
const main: Main = (exitProcess, redis, responder) => {
  observe(<any>evalCacheHashSet(redis), fromEvent('cacheHashSet', responder))
  observe(<any>evalCacheHashMultiSet(redis), fromEvent('cacheHashMultiSet', responder))
}

export default main
