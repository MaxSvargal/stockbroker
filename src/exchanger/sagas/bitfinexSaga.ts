import debug from 'debug'
import { all, call, take, fork, put } from 'redux-saga/effects'
import { eventChannel, delay, END } from 'redux-saga'

import bitfinexService from '../services/bitfinexService'
import * as actions from '../actions'

import bitfinexChannelsSaga from './bitfinexChannelsSaga'

const { PAIRS } = process.env

export default function* bitfinexSaga(): any {
  try {
    debug('worker')('Connect to bitfinex...')
    const pairs = PAIRS && PAIRS.split(',')
    const bws = yield call(bitfinexService)

    yield fork(bitfinexChannelsSaga, bws)

    if (Array.isArray(pairs))
      pairs.forEach(pair => {
        // bws.subscribeOrderBook(pair)
        bws.subscribeTicker(pair)
        bws.subscribeTrades(pair)
        bws.subscribeCandles(`t${pair}`, '1m')
      })

    bws.on('error', (err: Error) => { throw err })
    bws.on('close', () => { throw Error('Bitfinex connection closed') })

    debug('worker')('Connection to bitfinex socket established')
    debug('worker')('Listen pairs: ', PAIRS)
  } catch (err) {
    debug('worker')('Connection to bitfinex failed with error: ', err)
    yield delay(10000)
    yield fork(bitfinexSaga)
  }
}
