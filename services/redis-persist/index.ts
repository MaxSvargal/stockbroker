import { flatten, o, join, compose, flip, partialRight, concat, apply, map, curry, constructN, juxt, applyTo, partial, nth, invoker, converge, identity } from 'ramda'
import { SubscriberAdvertisement, Subscriber } from 'cote'
import { Stream, fromEvent, observe } from 'most'
import { RedisClient, createClient } from 'redis'

// Options
const name = 'Redis Persist Subscriber'
const subscribesTo = [ 'setCandles', 'updateCandle', 'setOrderbook', 'updateOrderbook' ]

// Constructors
const subscriberConstruct = constructN(1, Subscriber)
const subscriber = subscriberConstruct({ name, subscribesTo })
const redis = createClient()

type SubscriberApplicatve = (b: Subscriber) => Stream<Event>

type StreamFromEvent = (a: string) => SubscriberApplicatve
const streamFromEvent: StreamFromEvent = a => partial(fromEvent, [ a ])

type ApplyToSubscriber = (fn: SubscriberApplicatve) => Stream<Event>
const applyToSubscriber: ApplyToSubscriber = applyTo(subscriber)

const [ setCandles, updateCandle, setOrderbook, updateOrderbook ] =
  map(o(applyToSubscriber, streamFromEvent), subscribesTo)

// Candles adapter
const key = nth(0)
const timestamp = o(nth(0), nth(1))
const value = o(JSON.stringify, nth(1))
const values: any = compose(flatten, map((v: any[]) => [ nth(0, v), JSON.stringify(v) ]), nth(1))
const hset: (a: RedisClient) => Function = invoker(3, 'hset')
const hmset: (a: RedisClient) => Function = invoker(3, 'hmset')
const applyHset = converge(hset, [ key, timestamp, value ])
const applyHMset = converge(hmset, [ key, values ])

type EventToPreserve = (a: RedisClient) => (b: Event) => {}
const updateEventToPreserve: EventToPreserve = client => compose(applyTo(client), applyHset)
const setEventToPreserve: EventToPreserve = client => compose(applyTo(client), applyHMset)

// Observables
observe(updateEventToPreserve(redis), updateCandle)
observe(updateEventToPreserve(redis), updateOrderbook)

observe(setEventToPreserve(redis), setCandles)
observe(setEventToPreserve(redis), setOrderbook)
