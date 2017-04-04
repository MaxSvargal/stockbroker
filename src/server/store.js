import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from 'shared/reducers'
import rootSaga from 'server/sagas'

export default (scServer, pouchDB) => {
  const actionCatchMiddleware = () => next => action => {
    scServer.exchange.publish('update', action)
    next(action)
  }

  const persistStoreMiddleware = () => next => action => {
    // pouchDB
    next(action)
  }

  const sagaMiddleware = createSagaMiddleware()
  const middlewares = applyMiddleware(sagaMiddleware, actionCatchMiddleware, persistStoreMiddleware)
  const preloadedState = pouchDB.allDocs({ include_docs: true }).then(res => {
    const docs = res.rows.map(row => row.doc)
    console.log({ docs })
  })
  const persist = persistentStore(pouchDB)
  const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
  const store = createStoreWithMiddleware(rootReducer)

  sagaMiddleware.run(rootSaga(scServer))
  return store
}
