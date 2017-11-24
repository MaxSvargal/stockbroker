import debug from 'debug'
import { keys } from 'ramda'

import { keysPlularity, reducersPrularity, prefixArrWith, pairsToArr } from 'shared/reducers'
import createStore from 'shared/store'
import rootEpic from './epics'

import book from 'shared/reducers/orderBook'
import candles from 'shared/reducers/positions'
import tickers from 'shared/reducers/wallet'

const { PAIR = 'BTCUSD' } = process.env

debug('worker')(`Hello, i'm a Exchanger!`)

const toPublish = { book, candles, tickers }

export default createStore({
  rootEpic: rootEpic(`t${PAIR}`),
  reducers: reducersPrularity([ PAIR ])(toPublish),
  db: {
    subscribeTo: [],
    publishTo: prefixArrWith(PAIR, keys(toPublish))
  }
})
