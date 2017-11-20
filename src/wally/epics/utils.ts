import { Store } from 'redux'
import { apply, curry, prop, compose, invoker } from 'ramda'
import { Epic, ActionsObservable, ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

type Selector = (payload: any) => any
type CreateEpicWithState = (
  selectorFn: Selector,
  epic: ActionsObservable<Action>
) => any

export const fromStore = (store: Store<any>) => (selectorFn: Selector, payload: any) =>
  compose(selectorFn(payload), invoker(0, 'getState'))(store)

export const createEpicWithState = (epic: CreateEpicWithState) =>
  (action$: ActionsObservable<Action>, store: Store<any>): ActionsObservable<Action> =>
    epic(<any>fromStore(store), action$)(action$)

export const payloadProp = <any>prop('payload')

export const payloadOfType = (...keys: any[]) => (action$: Observable<Action>) =>
  compose(map(payloadProp), ofType(...keys))(action$)
