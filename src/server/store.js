import PouchDB from 'pouchdb'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistentStore, persistentReducer } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from 'shared/reducers'
import rootSaga from 'server/sagas'

export default scServer => {
  // move it?
  const db = new PouchDB('./server/db/stockbroker.alpha', { adapter: 'leveldb' })

  const actionCatchMiddleware = () => next => action => {
    scServer.exchange.publish('update', action)
    next(action)
  }

  const sagaMiddleware = createSagaMiddleware()
  const middlewares = applyMiddleware(sagaMiddleware, actionCatchMiddleware)
  const persist = persistentStore(db)
  const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
  const store = createStoreWithMiddleware(persistentReducer(rootReducer))

  sagaMiddleware.run(rootSaga)
  return store
}
