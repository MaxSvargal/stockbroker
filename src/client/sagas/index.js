import { call, take, fork, put, cancelled } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import ClientSocket from '../../shared/services/clientSocket'
import * as actions from '../../shared/actions'

const enabledProcedures = [
  actions.setBuyProfitThreshold,
  actions.setSellProfitThreshold,
  actions.setObsoleteThreshold,
  actions.setAutocreatedChunkAmount,
  actions.requestNewChunks,
  actions.removeChunk,
  actions.requestInvalidateChunks,
  actions.replaceChunksAmount
]

const changeStateChannel = session => eventChannel(emitter => {
  const sub = session.subscribe('newAction', emitter)
  /* eslint no-param-reassign: 0 */
  /* eslint no-underscore-dangle: 0 */
  session._socket.onclose = () => emitter(END)
  return () => session.unsubscribe(sub)
})

function* watchUpdates(session) {
  const chan = yield call(changeStateChannel, session)
  try {
    while (true) {
      const actionsArray = yield take(chan)
      const filteredProcedures = enabledProcedures.map(a => a.toString())
      const filtered = actionsArray.filter(action => !filteredProcedures.includes(action.type))
      yield filtered.map(action => put(action))
    }
  } finally {
    console.log('terminated')
    if (yield cancelled()) chan.close()
  }
}

export function* watchActionsForRPC(session) {
  while (true) {
    const action = yield take(enabledProcedures)
    console.log('call action to rpc', action)
    session.call(action.type, [ action ])
  }
}

export default function* clientWebSocketSaga() {
  try {
    const realm = window.location.pathname.match(/\/bot\/(.+)\/page/)[1].split('/').join('_')
    console.log({ realm })
    const session = yield call(ClientSocket, realm)
    yield [
      fork(watchUpdates, session),
      fork(watchActionsForRPC, session)
    ]
  } catch (err) {
    console.log('Can\'t connect to socket server', err)
  }
}
