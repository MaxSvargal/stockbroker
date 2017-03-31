import express from 'express'
import http from 'http'
import path from 'path'
import PouchDB from 'pouchdb'
// import WebSocket from 'ws'

import { createStore, applyMiddleware, compose } from 'redux'
import { persistentStore, persistentReducer } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'
import rootReducer from 'reducers'
import rootSaga from 'sagas'

const changeHandler = doc => console.log(doc);

const db = new PouchDB('./server/db/stockbroker.alpha', { adapter: 'leveldb' })
const app = express()
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore(db, changeHandler)
const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
const store = createStoreWithMiddleware(persistentReducer(rootReducer), compose())

sagaMiddleware.run(rootSaga)

app.use('/', express.static(path.join(__dirname, './dist')))

const server = http.createServer(app)

// const wss = new WebSocket.Server({ server })
//
// wss.on('connection', ws => {
//   ws.on('message', message =>
//     console.log('received: %s', message))
//   ws.send('something')
// })

server.listen(3000, () => console.log('Listening on %d', server.address().port))
