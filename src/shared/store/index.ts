import debug from 'debug'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'
import ReduxRedisPersist from 'shared/services/redisService'
import getRootReducer from 'shared/reducers'
import { setAccount } from 'shared/actions'

interface CreateStoreOptions {
  db: {
    prefix?: string,
    avalialbleToSet?: string[],
    avalialbleToSubscribe?: string[]
  },
  rootSaga: () => SagaIterator,
  account?: string
}

export default function createSrore(options: CreateStoreOptions) {
  const sagaMiddleware = createSagaMiddleware()
  const db = new ReduxRedisPersist(options.db)

  const rootReducer = getRootReducer(db)
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

  db.setStore(store)
  db.publisher.on('ready', () => {
    debug('worker')('Connection to redis server estableashed')
    sagaMiddleware.run(options.rootSaga)
    if (options.account) store.dispatch(setAccount(options.account))
  })

  return { store, db }
}
