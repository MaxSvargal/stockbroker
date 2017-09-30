import { delay } from 'redux-saga'
import { call, take, fork, put } from 'redux-saga/effects'
import { Session, RegisterEndpoint } from 'autobahn'
import CrossbarService from 'shared/services/crossbarService'
import * as actions from 'shared/actions'

const { ACCOUNT } = process.env

const enabledProcedures = [
  actions.execNewOrder
]

export function* watchRPCActions(session: Session) {
  while (true) {
    const action = yield take(enabledProcedures)
    session.call(action.type, [ action ])
  }
}

export default function* RPCSaga(): any {
  try {
    const realm = ACCOUNT || 'dev'
    const onclose = (reason: string) => { throw new Error(`Crossbar connection lost: ${reason}`) }
    const session = yield call(CrossbarService, { realm, onclose })

    yield fork(watchRPCActions, session)
  } catch (err) {
    yield delay(10000)
    yield call(RPCSaga)
  }
}
