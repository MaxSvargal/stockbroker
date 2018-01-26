import { flip, subtract, findIndex, apply, dropLast, both, lte, gte, find, last, nth, add, unapply, addIndex, map, o, compose, slice, converge, identity, always, filter, not } from 'ramda'
import { readFileSync } from 'fs'
import fetch from 'node-fetch'
import makeAnalysis from './analysis'

const mapIndexed = addIndex(map)
const mapToFloat = o(map, map, parseFloat)
const convert = compose(mapToFloat, JSON.parse, readFileSync)

const fetchCandles = async (symbol, interval) => {
  const res = await fetch(`https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=${interval}`)
  const json = await res.json()
  return mapToFloat(json)
}

const num = 26
const mapToFrames = mapIndexed((_, idx, list) => slice(idx, add(num, idx), list))
const flipedMap = flip(map)

describe('Signals Stats', () => {
  test.skip('demo', async () => {
    const symbol = 'WTCBTC'
    const [ candles1m ] = await Promise.all([ fetchCandles(symbol, '1m') ])

    // const candles1m = convert(`${__dirname}/candles1m_test.json`)
    // const candles5m = convert(`${__dirname}/candles5m_test.json`)

    const findTimeInFrames = (candles) => (time) => {
      const index = findIndex(both(o(lte(time), nth(6)), o(gte(time), nth(0))))(candles)
      return slice(subtract(index, 40), index)(candles)
    }

    const candlesFrames1m = compose(dropLast(num), mapToFrames)(candles1m)
    // const candlesFrames5m = map(compose(findTimeInFrames(candles5m), nth(6), last), candlesFrames1m)
    const mapToCandles = flipedMap([ candlesFrames1m, candlesFrames5m ])

    // mapIndexed((_, idx) =>
    //   apply(unapply(makeAnalysis), o(mapToCandles, nth)(idx))
    // )(candlesFrames1m)

    makeAnalysis([ candlesFrames1m ])
  })
})
