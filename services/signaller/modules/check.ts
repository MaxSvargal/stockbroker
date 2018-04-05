import { o, compose, nth, last, map, flip, converge, head, objOf } from 'ramda'

const getPrice = compose(parseFloat, nth(4), last)
const makeSignalConstruct = flip(converge)([ head, o(getPrice, last) ])
const signalConstruct = (side: 'BUY' | 'SELL') => (symbol: string, price: string) => ({ symbol, price, side })

export const getClosePrices = map(o(parseFloat, nth(4)))
export const closePricesAsValues = o(objOf('values'), getClosePrices)
export const makeSignal = o(makeSignalConstruct, signalConstruct)
