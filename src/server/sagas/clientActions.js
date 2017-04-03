import { eventChannel } from 'redux-saga'
import { call, take, put } from 'redux-saga/effects'

const onActionReceiveChannel = scServer => eventChannel(emitter => {
  let cSocket
  const handler = (data, res) =>
    emitter(data) || res(null, 'OK')

  scServer.on('connection', socket => {
    cSocket = socket
    socket.on('actions', handler)
  })
  return () => cSocket.off(handler)
})


export default function* clientActionsSaga(scServer) {
  const chan = yield call(onActionReceiveChannel, scServer)
  try {
    while (true) {
      const action = yield take(chan)
      yield put(action)
    }
  } finally {
    console.log('terminated')
  }
}
