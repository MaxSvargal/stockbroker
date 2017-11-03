import debug from 'debug'
import { delay, SagaIterator } from 'redux-saga'
import { all, fork, put, call } from 'redux-saga/effects'
import { __, map, compose, apply } from 'ramda'

import { execNewOrder, updateMyTrade } from 'shared/actions'
import { publishActions, watchForActions } from 'shared/sagas/redisRPC'

import store from '../index'
import mainLoopSaga from './mainLoop'

export default function* rootSaga(): SagaIterator {
  const { PAIR = 'BTCUSD' } = process.env
  const symbol = `t${PAIR}`
  const enabledPublishProcedures = [ execNewOrder ]
  const enabledSubscribeProcedures = [ updateMyTrade ]

  yield all([
    fork(mainLoopSaga, symbol),
    fork(watchForActions, store.db, enabledSubscribeProcedures),
    fork(publishActions, store.db, enabledPublishProcedures)
  ])
}
