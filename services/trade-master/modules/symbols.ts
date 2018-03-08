import { map, props, o, reverse, sortBy, nth, compose, head, converge, filter, contains, last } from 'ramda'

type Ticker = { symbol: string, priceChangePercent: string }

const onlyNeededProps = map(<(a: Ticker) => string[]>props([ 'symbol', 'priceChangePercent' ]))
const sortByLastVal = o(reverse, sortBy(nth(1)))
const prepareTicker = compose(map(head), sortByLastVal, onlyNeededProps)

type SuitableSymbolsFromTicker = (a: [ string, Ticker[] ]) => string[]
export const suitableSymbolsFromTicker: SuitableSymbolsFromTicker = converge(filter, [ o(contains, head), o(prepareTicker, last) ])