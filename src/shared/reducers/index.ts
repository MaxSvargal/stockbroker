import {
  map, split, xprod, compose, fromPairs, flatten,
  converge, zip, join, nth, keys, values, merge, curry
} from 'ramda'

const keyValuePair = converge(zip, [ keys, values ])
const joinNames = (v: any[]) => [ join('__', [ nth(0, v), nth(1, v) ]), nth(2, v) ]
const bindPair = converge(nth(2), [ nth(0) ])

export const prefixArrWith = (prefix: string, arr: string[]) =>
  map((name: string) => `${prefix}__${name}`, arr)

export const reducersPrularity = (pairs: string[]) =>
  compose(<any>fromPairs, map(joinNames), map(bindPair), map(<any>flatten), <any>xprod(pairs), keyValuePair)

export const keysPlularity = (pairs: string[]) =>
  compose(map(join('__')), <(v: string[]) => string[][]>xprod(pairs), keys)

export const pairsToArr = (pairs: string) => split(',', pairs)
