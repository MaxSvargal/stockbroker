import { eventChannel } from 'redux-saga'
import { fork, call, take, put } from 'redux-saga/effects'
import socketCluster from 'socketcluster-client'
import { setProfitThreshold, setObsoleteThreshold, setAutocreatedChunkAmount, requestNewChunks, removeChunk } from 'shared/actions'

const actions = [ setProfitThreshold, setObsoleteThreshold, setAutocreatedChunkAmount, requestNewChunks, removeChunk ]

const port = process.env.NODE_ENV === 'development' ? 8081 : window.location.port

const socket = socketCluster.connect({ port })

const changeStateChannel = () => eventChannel(emitter => {
  const channel = socket.subscribe('update')
  channel.watch(emitter)
  return channel.unsubscribe
})

function* serverActionsSaga() {
  const chan = yield call(changeStateChannel)
  const isInFiltered = type => actions.find(action => action.toString() === type)

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
    const action = yield take(actions)
    socket.emit('actions', action, err => err && console.error(err))
  }
}

export default function* root() {
  yield [
    fork(serverActionsSaga),
    fork(watchForActions)
  ]
}
