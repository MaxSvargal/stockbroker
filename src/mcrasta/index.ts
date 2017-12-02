import debug from 'debug'
import { merge, keys } from 'ramda'

import { keysPlularity, reducersPrularity, prefixArrWith, pairsToArr } from 'shared/reducers'
import createStore from 'shared/store'
import rootEpic from './epics'

import candles from 'shared/reducers/candles'
import macd from 'shared/reducers/macd'
import rsi from 'shared/reducers/rsi'

const { ACCOUNT = 'demo', PAIR = 'BTCUSD' } = process.env

debug('worker')(`Hello, ${ACCOUNT}! I'm MCRacta of ${PAIR}!`)

const toSubscribe = { candles, macd, rsi }

export default createStore({
  rootEpic,
  reducers: reducersPrularity([ PAIR ])(toSubscribe),
  db: {
    publishTo: [],
    subscribeTo: prefixArrWith(PAIR, keys(toSubscribe))
  }
})
