import debug from 'debug'
import { merge, keys } from 'ramda'

import { keysPlularity, reducersPrularity, prefixArrWith, pairsToArr } from 'shared/reducers'
import createStore from 'shared/store'
import rootEpic from './epics'

import candles from 'shared/reducers/positions'
import macd from 'shared/reducers/macd'
import rsi from 'shared/reducers/rsi'

const { PAIRS = 'BTCUSD,ETHUSD' } = process.env

debug('worker')(`Hello, i'm CompSig! ${PAIRS}`)

const pairs = pairsToArr(PAIRS)
const toSubscribe = { candles }
const toPublish = { macd, rsi }

const pairsKeys = keysPlularity(pairs)
const pairsReducers = reducersPrularity(pairs)

export default createStore({
  rootEpic: rootEpic(pairs),
  reducers: merge(
    pairsReducers(toPublish),
    pairsReducers(toSubscribe)
  ),
  db: {
    subscribeTo: pairsKeys(toSubscribe),
    publishTo: pairsKeys(toPublish)
  }
})
