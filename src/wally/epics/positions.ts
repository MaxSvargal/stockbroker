import { apply, compose, curry, path, prop, always } from 'ramda'
import { fromStore, createEpicWithState, Epic, Store, ActionsObservable } from './utils'

import { ofType } from 'redux-observable'
import { map, mapTo, mergeMap } from 'rxjs/operators'

type ActionWithPayload = { type: string, payload: any }

const pongAction = (payload: any) =>
  ({ type: 'PONG', payload })

const selectPair = (state: any, { symbol }: { symbol: string }) =>
  path([ 'tickers', symbol, 'current' ])(state)

// export const testEpic = (action$: ActionsObservable<Action>, store: Store<{}>) =>
//   compose(
//     map(pongAction),
//     map(compose(fromStore(store, selectPair), prop('payload'))),
//     ofType('PING')
//   )(action$)

export const testEpic = createEpicWithState(fromState =>
  compose(
    map(pongAction),
    map(compose(fromState(selectPair), prop('payload'))),
    ofType('PING')
  )
)

export default compose(
  mapTo({ type: 'PING', payload: { symbol: 'tBTCUSD' } }),
  ofType('SET_ACCOUNT')
)
