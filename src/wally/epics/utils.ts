import { apply, filter, curry, prop, propEq } from 'ramda'
import { Epic, ActionsObservable, combineEpics } from 'redux-observable'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/mapTo'
import { Store } from 'redux'

export { Store } from 'redux'
export { Epic, ActionsObservable } from 'redux-observable'

type CreateEpicWithState = (
  selectorFn: (selector: Function) => any,
  epic: ActionsObservable<Action>
) => any

export const fromStore = curry(
  (store: Store<any>, selectorFn: (state: any, payload: any) => any, payload: any) =>
    apply(selectorFn, [ store.getState(), payload ]))

export const createEpicWithState = (epic: CreateEpicWithState) =>
  (action$: ActionsObservable<Action>, store: Store<any>) =>
    epic(fromStore(store), action$)(action$)
