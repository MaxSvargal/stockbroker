import express from 'express'
import PouchDB from 'pouchdb'
import createStore from './store'
import handleRender from './renderer'

const { DB_PATH } = process.env

/* eslint import/prefer-default-export: 0 */
export const run = worker => {
  console.log('Worker PID:', process.pid)

  const { httpServer, scServer } = worker
  const app = express()
  const pouchDB = new PouchDB(DB_PATH, { adapter: 'leveldb', revs_limit: 1, auto_compaction: true })
  const store = createStore(scServer, pouchDB)

  app.use(express.static('public', { maxAge: 10000 }))
  app.use(handleRender(store))

  httpServer.on('request', app)
}
