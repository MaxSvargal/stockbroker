import { call, take, fork } from 'redux-saga/effects'

import ClientSocket from '../../shared/services/clientSocket'
import store from '../index'
import * as actions from '../../shared/actions'

const { DB_NAME } = process.env

export function* watchForActionsAndPublish(session) {
  while (true) {
    const action = yield take('*')
    session.publish('newAction', [ action ])
  }
}

const registerActionAsProcedure = (session) => (action, handler) =>
  session.register(action.toString(), res =>
    ((handler && handler()) || store.dispatch(res[0]) || 'OK'))
    .catch(err => console.log(err))

export default function* clientWebSocketSaga() {
  try {
    const session = yield call(ClientSocket, DB_NAME)
    const register = registerActionAsProcedure(session)

    register(actions.setSellProfitThreshold)
    register(actions.setBuyProfitThreshold)
    register(actions.setObsoleteThreshold)
    register(actions.setAutocreatedChunkAmount)
    register(actions.requestNewChunks)
    register(actions.removeChunk)
    register(actions.requestInvalidateChunks)
    register(actions.replaceChunksAmount)

    yield fork(watchForActionsAndPublish, session)
  } catch (err) {
    console.log('Can\'t connect to crossbar router', err)
  }
}
