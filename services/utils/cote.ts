import { constructN } from 'ramda'
import { Requester, Responder, Publisher, Subscriber, DiscoveryOptions } from 'cote'
import Binance from 'binance-api-node'

type RequesterCons = (options: { name: string, key: string, requests: string[] }) => Requester
export const requesterCons: RequesterCons = constructN(1, Requester)

type ResponderCons = (options: { name: string, key: string, respondsTo: string[] }) => Responder
export const responderCons: ResponderCons = constructN(1, Responder)

type PublisherCons = (options: { name: string, broadcasts: string[] }) => Publisher
export const publisherCons: PublisherCons = constructN(1, Publisher)

type SubscriberCons = (options: { name: string, subscribesTo: string[] }) => Subscriber
export const subscriberCons: SubscriberCons = constructN(1, Subscriber)

type BinanceCons = (options?: { apiKey: string, apiSecret: string }) => typeof Binance
export const binanceCons = constructN(1, Binance)
