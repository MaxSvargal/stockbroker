import { call, take, fork } from 'redux-saga/effects'

import ClientSocket from '../../shared/services/clientSocket'
import store from '../index'

export function* watchForActionsAndPublish(session) {
  while (true) {
    const action = yield take('*')
    session.publish('newAction', [ action ])
  }
}

export default function* clientWebSocketSaga() {
  try {
    const session = yield call(ClientSocket)
    session.register('getInitialState', store.getState)

    yield fork(watchForActionsAndPublish, session)
  } catch (err) {
    console.log('Can\'t connect to socket server', err)
  }
}
