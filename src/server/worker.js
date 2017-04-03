import express from 'express'
import basicAuth from 'express-basic-auth'
import createStore from './store'
import handleRender from './renderer'

/* eslint import/prefer-default-export: 0 */
export const run = worker => {
  console.log('Worker PID:', process.pid)

  const { httpServer, scServer } = worker
  const app = express()
  const store = createStore(scServer)

  app.use(basicAuth({ users: { stockbroker: 'toptrader88' } }))
  app.use(express.static('public', { maxAge: 1000 }))
  app.use(handleRender(store))

  httpServer.on('request', app)
}
