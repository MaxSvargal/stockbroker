import { call, take, fork } from 'redux-saga/effects'

import ClientSocket from '../../shared/services/clientSocket'
import store from '../index'
import * as actions from '../../shared/actions'

const { ACCOUNT_NAME, CURRENCY_PAIR } = process.env

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
    const realm = (ACCOUNT_NAME, CURRENCY_PAIR).join('/').replace('_', '/').toLowerCase()
    console.log({ realm })
    const session = yield call(ClientSocket, realm)
    const register = registerActionAsProcedure(session)

    register('getInitialState', store.getState)
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
    console.log('Can\'t connect to socket server', err)
  }
}
