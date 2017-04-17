import express from 'express'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import handleRender from './renderer'

import rootReducer from '../shared/reducers'
import rootSaga from '../shared/sagas/client'

const app = express()
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const store = createStore(rootReducer, middlewares)

sagaMiddleware.run(rootSaga)

app.use(handleRender(store))

app.listen(8080)
