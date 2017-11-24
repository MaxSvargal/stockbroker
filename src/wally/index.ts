import debug from 'debug'
import { merge, keys } from 'ramda'

import { keysPlularity, reducersPrularity, prefixArrWith, pairsToArr } from 'shared/reducers'
import createStore from 'shared/store'
import rootEpic from './epics'

import book from 'shared/reducers/orderBook'
import positions from 'shared/reducers/positions'
import wallet from 'shared/reducers/wallet'

const { ACCOUNT = 'demo', PAIRS = 'BTCUSD,ETHUSD' } = process.env

debug('worker')(`Hello, ${ACCOUNT}! I'm a Wally!`)

const pairs = pairsToArr(PAIRS)
const toSubscribe = { book }
const toPublish = { wallet, positions }

export default createStore({
  rootEpic,
  reducers: merge(
    reducersPrularity(pairs)(toSubscribe),
    reducersPrularity([ ACCOUNT ])(toPublish)
  ),
  db: {
    subscribeTo: keysPlularity(pairs)(toSubscribe),
    publishTo: prefixArrWith(ACCOUNT, keys(toPublish))
  }
})
