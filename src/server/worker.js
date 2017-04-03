import express from 'express'
import createStore from './store'
import handleRender from './renderer'

export const run = worker => {
  console.log('Worker PID:', process.pid)

  const { httpServer, scServer } = worker
  const app = express()
  const store = createStore(scServer)

  app.use(express.static('public', { maxAge: 1000 }))
  // app.use(express.static('public', { maxAge: 86400000 * 365, index: false }))
  // app.use(express.static('public', { index: 'index.html' }))
  app.use(handleRender(store))

  httpServer.on('request', app)
}
