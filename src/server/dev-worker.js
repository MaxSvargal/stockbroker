import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import PouchDB from 'pouchdb'
import createStore from './store'
import handleRender from './renderer'
import webpackConfig from '../../webpack.config.client.dev'

/* eslint import/prefer-default-export: 0 */
export const run = worker => {
  console.log('Worker PID:', process.pid)

  const { httpServer, scServer } = worker
  const app = express()
  const pouchDB = new PouchDB('./server/db/dev', { adapter: 'leveldb' })
  const store = createStore(scServer, pouchDB)
  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, { publicPath: '/', noInfo: true }))
  app.use(webpackHotMiddleware(compiler))
  app.use(handleRender(store))

  httpServer.on('request', app)
}
