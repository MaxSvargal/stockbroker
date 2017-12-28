import { constructN } from 'ramda'
import { Publisher, Subscriber } from 'cote'
import * as BFX from 'bitfinex-api-node'

type PublisherCons = (options: { name: string }) => Publisher
export const publisherCons: PublisherCons = constructN(1, Publisher)

type SubscriberCons = (options: { name: string, subscribesTo: string[] }) => Subscriber
export const subscriberCons: SubscriberCons = constructN(1, Subscriber)

type BFXCons = (key: any, secret: any, options: any) => typeof BFX
export const bfxCons: BFXCons = constructN(3, BFX)
