import debug from 'debug'
import { merge, keys } from 'ramda'

import { keysPlularity, reducersPrularity, prefixArrWith, pairsToArr } from 'shared/reducers'
import createStore from 'shared/store'
import rootEpic from './epics'

import candles from 'shared/reducers/positions'
import macd from 'shared/reducers/macd'
import rsi from 'shared/reducers/rsi'

const { PAIR = 'BTCUSD' } = process.env

debug('worker')(`Hello, i'm CompSig! ${PAIR}`)

const toSubscribe = { candles }
const toPublish = { macd, rsi }

const pairsReducers = reducersPrularity([ PAIR ])

export default createStore({
  rootEpic: rootEpic(PAIR),
  reducers: merge(
    pairsReducers(toPublish),
    pairsReducers(toSubscribe)
  ),
  db: {
    subscribeTo: prefixArrWith(PAIR, keys(toSubscribe)),
    publishTo: prefixArrWith(PAIR, keys(toPublish))
  }
})
