import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from 'shared/reducers'
import rootSaga from 'client/sagas'

const { NODE_ENV } = process.env

/* eslint no-underscore-dangle: 0 */
const preloadedState = window.__PRELOADED_STATE__
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

const sagaMiddleware = createSagaMiddleware()
const devTools = NODE_ENV !== 'production' && global.devToolsExtension ? global.devToolsExtension() : f => f
const composedMiddlewares = compose(applyMiddleware(sagaMiddleware), devTools)

const store = createStore(rootReducer, preloadedState, composedMiddlewares)

sagaMiddleware.run(rootSaga)

if (NODE_ENV !== 'production' && module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('shared/reducers', () => {
    /* eslint global-require: 0 */
    const nextRootReducer = require('shared/reducers')
    store.replaceReducer(nextRootReducer)
  })
}

export default store
