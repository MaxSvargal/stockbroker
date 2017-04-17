import { call, take, put, fork, cancelled } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import ClientSocket from '../services/client.wss'

const registerRPCCommands = (session, topics) => eventChannel(emitter => {
  const registered = topics.map(t => session.register(t, emitter))
  console.log(registered)
  /* eslint no-underscore-dangle: 0 */
  /* eslint no-param-reassign: 0 */
  session._socket.onclose = () => emitter(END)
  return () => {}
})

function* registerProcedures(session) {
  const rpcChan = yield call(registerRPCCommands, session, [
    'setBuyProfitThreshold', 'setSellProfitThreshold'
  ])

  try {
    while (true) {
      const action = yield take(rpcChan)
      console.log('received', action)
      // yield put(action)
    }
  } finally {
    console.log('terminated')
    if (yield cancelled()) rpcChan.close()
  }
}

export function* watchForActionsAndPublish(session) {
  while (true) {
    const action = yield take('*')
    session.publish('newAction', [ action ])
  }
}

export default function* clientWebSocketSaga() {
  try {
    const session = yield call(ClientSocket)
    yield [
      fork(registerProcedures, session),
      fork(watchForActionsAndPublish, session)
    ]
  } catch (err) {
    console.log('Can\'t connect to socket server', err)
  }
}
