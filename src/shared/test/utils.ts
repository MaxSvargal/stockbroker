import configureStore from 'redux-mock-store'
import { TestScheduler, Observable } from 'rxjs'
import { createEpicMiddleware, ActionsObservable } from 'redux-observable'
import { Action } from 'shared/types'

const mockStore = configureStore()

export const createTestScheduler = () =>
  new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected))

export function testAction<A>
  (testScheduler: TestScheduler, marbles: string, values?: any) {
    return new ActionsObservable<Action>(testScheduler.createHotObservable(marbles, values)) }

export const run = (epicFn: Function, state: {}, inputMarble: string, ouputMarble: string, inputActions: {}, outputActions: {}) => {
  const testScheduler = createTestScheduler()
  const action$ = testAction<Action>(testScheduler, inputMarble, inputActions)
  const store = mockStore(state)
  const outputAction$ = epicFn(action$, store)
  testScheduler.expectObservable(outputAction$).toBe(ouputMarble, outputActions)
  testScheduler.flush()
}
