import { all, fork } from 'redux-saga/effects'

function* dummy() {
  console.log('started')
}

export default function* rootSaga() {
  yield all([
    fork(dummy)
  ])
}
