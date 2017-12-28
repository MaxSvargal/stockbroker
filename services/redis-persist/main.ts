import { juxt, identity, unnest, uncurryN, flip, compose, map, nth, invoker, converge } from 'ramda'
import { fromEvent, observe } from 'most'
import { RedisClient } from 'redis'
import { Subscriber } from 'cote'

const json = JSON.stringify
const hash = nth(0)
const field = compose(json, nth(0), nth(1))
const value = compose(json, nth(1))
const timeAsKey = juxt([ nth(0), identity ])
const values = compose(<any>unnest, map(compose(map(json), timeAsKey)), nth(1))
const invokeHset = invoker(3, 'hset')
const invokeHmset = invoker(2, 'hmset')
const applyHset = converge(invokeHset, [ hash, field, value ])
const applyHMset = converge(invokeHmset, [ hash, values ])

type EventToPreserve = (a: RedisClient) => (b: Event) => any
const preserveHset: EventToPreserve = flip(uncurryN(2, applyHset))
const preserveHMset: EventToPreserve = flip(uncurryN(2, applyHMset))

type Main = (a: (a: Event) => void, b: RedisClient, c: Subscriber) => void
const main: Main = (exitProcess, redis, subscriber) => {
  const storeSetStream = fromEvent('storeSet', subscriber)
  const storeUpdateStream = fromEvent('storeUpdate', subscriber)

  const preserveSet = preserveHMset(redis)
  const preserveUpdate = preserveHset(redis)

  observe(preserveSet, storeSetStream)
  observe(preserveUpdate, storeUpdateStream)
}

export default main
