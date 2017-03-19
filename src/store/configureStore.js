import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from 'reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState = {}) {
  const middleware = applyMiddleware(sagaMiddleware)
  const middlewares = composeEnhancers ? composeEnhancers(middleware) : middleware

  const store = createStore(rootReducer, initialState, middlewares)

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
