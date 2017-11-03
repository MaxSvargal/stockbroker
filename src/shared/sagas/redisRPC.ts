import { eventChannel } from 'redux-saga'
import { call, take, fork, put } from 'redux-saga/effects'
import { SimpleActionCreator } from 'redux-act'
import { Store } from 'redux'
import { map, any, equals, curry } from 'ramda'

import ReduxRedisPersist from 'shared/services/redisService'

const { ACCOUNT } = process.env

export function* watchForActions(db: ReduxRedisPersist, procedures: SimpleActionCreator<{}>[]) {
  const chan = eventChannel(emitter => {
    db.subscribe('action', emitter)
    return () => db.unsubscribe('action')
  })

  const isTypeEnabled = curry((arr: any, action: { type: string }) =>
    any(equals(action.type))(arr))(map(p => p.toString(), procedures))

  while(true) {
    try {
      const msg = yield take(chan)
      const action = JSON.parse(msg)
      if (isTypeEnabled(action)) yield put(action)
    } catch (err) {
      console.error(err)
    }
  }
}

export function* publishActions(db: ReduxRedisPersist, procedures: SimpleActionCreator<{}>[]) {
  while (true) {
    try {
      const action = yield take(procedures)
      db.publish('action', action)
    } catch (err) {
      console.error(err)
    }
  }
}
