import { eventChannel } from 'redux-saga'
import { fork, call, take, put } from 'redux-saga/effects'
import socketCluster from 'socketcluster-client'

const socket = socketCluster.connect({ port: 5000 })

const changeStateChannel = () => eventChannel(emitter => {
  const channel = socket.subscribe('update')
  channel.watch(emitter)
  return channel.unsubscribe
})

// function* getInitialState() {
//   socket.on('takeInitialState')
//   socket.emit('getInitialState')
// }

function* serverActionsSaga() {
  const chan = yield call(changeStateChannel)
  try {
    while (true) {
      const action = yield take(chan)
      yield put(action)
    }
  } finally {
    console.log('terminated')
  }
}

export default function* root() {
  yield [
    // fork(getInitialState),
    fork(serverActionsSaga)
  ]
}
