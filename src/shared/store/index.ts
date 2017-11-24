import debug from 'debug'
import { Functor, curry, fromPairs, map, converge, zip, keys, values } from 'ramda'
import { Reducer, applyMiddleware, compose, createStore, combineReducers } from 'redux'
import ReduxRedisPersist from 'shared/services/redisService'
import { setAccount, initialized, signalRequest } from 'shared/actions'
import { createEpicMiddleware } from 'redux-observable'

const createLogger = require('redux-node-logger')

interface CreateStoreOptions {
  db: {
    prefix?: string,
    publishTo: any // string[] | Functor<string>,
    subscribeTo: any // string[] | Functor<string>
  },
  reducers: {
    [name: string]: any // Reducer<any>
  },
  rootEpic: any,
  account?: string
}

const toPersistent = curry((persistDB: ReduxRedisPersist, [ name, fn ]: [ string, Reducer<any> ]) =>
  [ name, persistDB.persistentReducer(fn, { name }) ])

type PersistReducers = (db: ReduxRedisPersist) => (...args: any[]) => Reducer<{}>
const persistReducers: PersistReducers = db => compose(
  combineReducers,
  fromPairs,
  map(toPersistent(db)),
  converge(zip, [ keys, values ])
)

export default function createSrore(options: CreateStoreOptions) {
  const db = new ReduxRedisPersist(options.db)
  const rootReducer = persistReducers(db)(options.reducers)
  const epicMiddleware = createEpicMiddleware(options.rootEpic)
  const loggerMiddleware = createLogger()
  const storeEnhancers = compose(applyMiddleware(epicMiddleware, loggerMiddleware))
  const store = createStore(rootReducer, storeEnhancers)

  db.setStore(store)
  db.publisher.on('ready', () => {
    debug('worker')('Connection to redis server estableashed')
    if (options.account) store.dispatch(setAccount(options.account))
    store.dispatch(initialized())

    // setTimeout(() => {
    //   store.dispatch(signalRequest({
    //     type: 'sell',
    //     symbol: 'tDATUSD',
    //     from: 'mcrasta',
    //     options: {
    //       usePercentOfFund: 1,
    //       maxChunksNumber: 15,
    //       minChunkAmount: 158,
    //       minThreshold: 0.001
    //     }
    //   }))
    // }, 10000)
  })

  return { store, db }
}
