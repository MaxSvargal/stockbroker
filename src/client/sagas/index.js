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
  session._socket.onclose = () => emitter(END)
  return () => session.unsubscribe(sub)
})

function* watchUpdates(session) {
  const chan = yield call(changeStateChannel, session)
  try {
    while (true) {
      const actionsArray = yield take(chan)
      yield actionsArray
        .filter(({ type }) =>
          enabledProcedures.map(p => p.toString()).indexOf(type) !== -1)
        .map(action => put(action))
    }
  } finally {
    console.log('terminated')
    if (yield cancelled()) chan.close()
  }
}

export function* watchActionsForRPC(session) {
  while (true) {
    const action = yield take(enabledProcedures)
    session.call(action.type, [ action ])
  }
}

export default function* clientWebSocketSaga() {
  try {
    const session = yield call(ClientSocket)
    yield [
      fork(watchUpdates, session),
      fork(watchActionsForRPC, session)
    ]
  } catch (err) {
    console.log('Can\'t connect to socket server', err)
  }
}
