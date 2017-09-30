import debug from 'debug'
import { delay } from 'redux-saga'
import { call, take, fork } from 'redux-saga/effects'
import { Session, RegisterEndpoint } from 'autobahn'
import { ActionCreator } from 'redux-act'

import store from 'exchanger'
import CrossbarService from 'shared/services/crossbarService'
import * as actions from 'shared/actions'

const { ACCOUNT } = process.env

const avaliableProcedures = [
  actions.execNewOrder,
  actions.setPassiveTrading
]

export function* watchForActionsAndPublish(session: Session) {
  while (true) {
    const action = yield take('*')
    // TODO: check session
    session.publish('newAction', [ action ])
  }
}

const registerActionAsProcedure = (session: Session) => (action: ActionCreator<any>) =>
  session.register(action.toString(), (args: { type: string, payload: any }[]) =>
    store.dispatch(args[0]))

export function* connectSaga() {
  try {
    const realm = ACCOUNT || 'dev'
    const onclose = (reason: string) => {
      debug('worker')('Crossbar connection lost', reason)
      throw new Error(`Crossbar connection lost: ${reason}`)
    }

    const session = yield call(CrossbarService, { realm, onclose })
    const register = registerActionAsProcedure(session)
    avaliableProcedures.forEach(register)

    // yield fork(watchForActionsAndPublish, session)
    debug('worker')('Connection to router socket established')
  } catch (err) {
    throw new Error(`Can't connect to websocket router: ${err}`)
  }
}

export default function* crossbarServiceSaga(): any {
  try {
    debug('worker')('Connect to crossbar...')
    yield call(connectSaga)
    debug('worker')('Crossbar connection established')
  } catch (err) {
    yield delay(10000)
    yield call(crossbarServiceSaga)
  }
}
