import debug from 'debug'
import { delay, SagaIterator } from 'redux-saga'
import { all, fork, put, call } from 'redux-saga/effects'
import { __, map, compose, apply } from 'ramda'

import { execNewOrder } from 'shared/actions'
import { publishActions } from 'shared/sagas/redisRPC'

import store from '../index'
import mainLoopSaga from './mainLoop'

export default function* rootSaga(): SagaIterator {
  const { PAIR = 'BTCUSD' } = process.env
  const symbol = `t${PAIR}`
  const enabledProcedures = [ execNewOrder ]

  yield all([
    fork(mainLoopSaga, symbol),
    fork(publishActions, store.db, enabledProcedures)
  ])
}
