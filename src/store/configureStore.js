import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import replicate from 'redux-replicate'
import localforage from 'redux-replicate-localforage'
import rootReducer from 'reducers'

const replicateEnable = true

/* eslint no-underscore-dangle: 0 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState = {}) {
  let create
  const composeFn = composeEnhancers || compose
  const middlewares = applyMiddleware(sagaMiddleware)

  if (replicateEnable) {
    localforage.debounce = 5000
    const key = 'PoloniexGolumBotStorageUnit'

    const reducerKeys = [
      'botMessages', 'buy', 'sell', 'threshold', 'stats', 'myBuys',
      'mySells', 'myFailureSells', 'myFailureBuys', 'freeCurrencies', 'currentPair'
    ]
    const replicator = localforage
    const replication = replicate({ key, reducerKeys, replicator })

    create = composeFn(replication, middlewares)(createStore)
  } else {
    create = composeFn(middlewares)(createStore)
  }

  const store = create(rootReducer, initialState)

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    /* eslint global-require: 0 */
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
