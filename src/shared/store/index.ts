import debug from 'debug'
import { Action, applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'
import ReduxRedisPersist from 'shared/services/redisService'
import getRootReducer from 'shared/reducers'
import { setAccount, initialized } from 'shared/actions'
import { createEpicMiddleware } from 'redux-observable'

const createLogger = require('redux-node-logger')

interface CreateStoreOptions {
  db: {
    prefix?: string,
    avalialbleToSet?: string[],
    avalialbleToSubscribe?: string[]
  },
  rootSaga?: () => SagaIterator,
  rootEpic: any,
  account?: string
}

export default function createSrore(options: CreateStoreOptions) {
  const sagaMiddleware = createSagaMiddleware()
  const db = new ReduxRedisPersist(options.db)

  const rootReducer = getRootReducer(db)
  const epicMiddleware = createEpicMiddleware(options.rootEpic)
  const loggerMiddleware = createLogger()
  const storeEnhancers = compose(applyMiddleware(sagaMiddleware, epicMiddleware, loggerMiddleware))
  const store = createStore(rootReducer, storeEnhancers)

  db.setStore(store)
  db.publisher.on('ready', () => {
    debug('worker')('Connection to redis server estableashed')
    // sagaMiddleware.run(options.rootSaga)
    if (options.account) store.dispatch(setAccount(options.account))
    store.dispatch(initialized())
  })

  return { store, db }
}
