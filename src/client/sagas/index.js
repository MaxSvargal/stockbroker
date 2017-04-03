import { eventChannel } from 'redux-saga'
import { fork, call, take, put } from 'redux-saga/effects'
import socketCluster from 'socketcluster-client'
import { setThreshold, sendSells, sendBuys, removeOpenBuys, removeOpenSells } from 'shared/actions'

const socket = socketCluster.connect({ port: 8080 })

const changeStateChannel = () => eventChannel(emitter => {
  const channel = socket.subscribe('update')
  channel.watch(emitter)
  return channel.unsubscribe
})

function* serverActionsSaga() {
  const chan = yield call(changeStateChannel)
  const filtered = [ setThreshold, sendSells, sendBuys, removeOpenBuys, removeOpenSells ]
  const isInFiltered = type => filtered.find(action => action.toString() === type)

  try {
    while (true) {
      const action = yield take(chan)
      if (!isInFiltered(action.type)) yield put(action)
    }
  } finally {
    console.log('terminated')
  }
}

function* watchForActions() {
  while (true) {
    const actions = [ setThreshold, sendSells, sendBuys, removeOpenBuys, removeOpenSells ]
    const action = yield take(actions)
    console.log('take', action)
    socket.emit('actions', action, err => err && console.error(err))
  }
}

export default function* root() {
  yield [
    fork(serverActionsSaga),
    fork(watchForActions)
  ]
}
