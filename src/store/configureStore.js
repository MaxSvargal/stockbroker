import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import replicate from 'redux-replicate';
import localforage from 'redux-replicate-localforage';
import rootReducer from 'reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const sagaMiddleware = createSagaMiddleware()
const onStateChange = ({
  store,
  reducerKey,
  nextState,
  queryable,
  setStatus,
  setError
}) => {
  console.log('updated', store, reducerKey)

  localforage
    .setItem(getItemKey(store.key, reducerKey), stringify(nextState))
    .then(() => setStatus())
    .catch(setError)
};
const key = 'PoloniexGolumBotStorageUnit'
const reducerKeys = [ 'ask', 'bid', 'buy', 'sell', 'currencies', 'currentPair' ]
const initialState = {
  ask: [],
  bid: [],
  buy: [],
  sell: [],
  currencies: {},
  currentPair: {}
}
localforage.debounce = 10000
const replicator = localforage

export default function configureStore(initialState = {}) {
  const replication = replicate({ key, reducerKeys, replicator, onStateChange })
  const create = composeEnhancers ?
    composeEnhancers(/*replication, */applyMiddleware(sagaMiddleware))(createStore) :
    compose(/*replication, */applyMiddleware(sagaMiddleware))(createStore)
  // const middlewares = composeEnhancers ? composeEnhancers(create) : create
  const store = create(rootReducer, initialState)

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
