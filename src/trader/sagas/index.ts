import { all, fork, select } from 'redux-saga/effects'
import analyticsSaga from './analytics'
import RPCSaga from './rpc'

export default function* rootSaga() {
  yield all([
    fork(RPCSaga),
    fork(analyticsSaga)
  ])
}
