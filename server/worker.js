import express from 'express'
import path from 'path'
import serveStatic from 'serve-static'
import PouchDB from 'pouchdb'

import { createStore, applyMiddleware, compose } from 'redux'
import { persistentStore, persistentReducer } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'
import rootReducer from 'reducers'
import rootSaga from 'sagas'

export const run = worker => {
  console.log('   >> Worker PID:', process.pid)

  const { httpServer, scServer } = worker

  const db = new PouchDB('./server/db/stockbroker.alpha', { adapter: 'leveldb' })
  const app = express()
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = applyMiddleware(sagaMiddleware)
  const persist = persistentStore(db)
  const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
  const store = createStoreWithMiddleware(persistentReducer(rootReducer), compose())

  sagaMiddleware.run(rootSaga)

  // app.use('/', express.static(path.join(__dirname, '/server/dist')))
  app.use(serveStatic(path.resolve(__dirname, 'dist')))

  httpServer.on('request', app)

  scServer.on('connection', socket => {
    socket.on('sampleClientEvent', data =>
      scServer.exchange.publish('sample', 'fooo'))

    setInterval(() => {
      socket.emit('rand', {
        rand: Math.floor(Math.random() * 5)
      })
    }, 1000)
  })

  // const server = http.createServer(app)

  // const socketSocketCluster = new SocketCluster({
  //   workers: 1,
  //   brokers: 1,
  //   wsEngine: 'uws'
  // })
}

// server.listen(3000, () => console.log('Listening on %d', server.address().port))
