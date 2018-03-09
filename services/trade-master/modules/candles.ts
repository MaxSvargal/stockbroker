import { map, zipObj, o, append, converge, xprod, head, of, last, compose, pair } from 'ramda'

type CandlesRequest = { limit: number, symbol: string, interval: string }

const limit = 28
const intervals = [ '6h', '2h', '30m' ]
const zipReqArrToObj = map(zipObj([ 'interval', 'symbol', 'limit' ]))
const mapAppend = o(map, append)
const makeCandlesRequests = compose(zipReqArrToObj, mapAppend(limit), o(<any>xprod(intervals), of))

type FetchCandles = (fetch: (a: CandlesRequest) => Promise<Response>) => (symbol: string) => Promise<Response>
export const makeFetchCandles: FetchCandles = fetch => symbol =>
  Promise.all(<any>map(fetch, makeCandlesRequests(symbol))).then(pair(symbol))

