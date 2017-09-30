import { all, fork, select } from 'redux-saga/effects'
import analyticsSaga from './analytics'
import RPCSaga from 'shared/sagas/rpc'

export default function* rootSaga() {
  yield all([
    fork(RPCSaga),
    fork(analyticsSaga)
  ])
}
