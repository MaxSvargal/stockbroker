import { call, take, fork, cancelled } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import ClientSocket from '../../worker/services/client.wss'
import * as actions from '../actions'

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

function* watchForUpdates(session) {
  const chan = yield call(changeStateChannel, session)
  try {
    while (true) {
      const action = yield take(chan)
      console.log('received', action)
      // yield put(action)
    }
  } finally {
    console.log('terminated')
    if (yield cancelled()) chan.close()
  }
}

export function* watchForActionsAndCallRPC(session) {
  while (true) {
    const action = yield take(enabledProcedures)
    session.call(action.type, action.payload)
  }
}

export default function* clientWebSocketSaga() {
  try {
    const session = yield call(ClientSocket)
    yield [
      fork(watchForUpdates, session),
      fork(watchForActionsAndCallRPC, session)
    ]
  } catch (err) {
    console.log('Can\'t connect to socket server', err)
  }
}



// import { eventChannel } from 'redux-saga'
// import { fork, call, take, put } from 'redux-saga/effects'
// import * as actions from '../actions'
//
// const enabledActions = [
//   actions.setBuyProfitThreshold,
//   actions.setSellProfitThreshold,
//   actions.setObsoleteThreshold,
//   actions.setAutocreatedChunkAmount,
//   actions.requestNewChunks,
//   actions.removeChunk,
//   actions.requestInvalidateChunks,
//   actions.replaceChunksAmount
// ]
//
// const { BROWSER, PORT } = process.env
//
// const port = BROWSER ? window.location.port : PORT
//
// const socket = socketCluster.connect({ port })
//
// const changeStateChannel = () => eventChannel(emitter => {
//   const channel = socket.subscribe('update')
//   channel.watch(emitter)
//   return channel.unsubscribe
// })
//
// function* serverActionsSaga() {
//   const chan = yield call(changeStateChannel)
//   const isInFiltered = type => enabledActions.find(action => action.toString() === type)
//
//   try {
//     while (true) {
//       const action = yield take(chan)
//       if (!isInFiltered(action.type)) yield put(action)
//     }
//   } finally {
//     console.log('terminated')
//   }
// }
//
// function* watchForActions() {
//   while (true) {
//     const action = yield take(enabledActions)
//     socket.emit('actions', action, err => err && console.error(err))
//   }
// }
//
// // function* awaitInitialState() {
// //   yield call(requestInitialState)
// //   sodket.emit('getInitialState')
// // }
//
// export default function* root() {
//   yield [
//     fork(serverActionsSaga),
//     fork(watchForActions)
//   ]
// }
