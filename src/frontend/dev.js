import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaStatic from 'koa-static'
import webpackDevMiddleware from 'koa-webpack-dev-middleware'
import webpackHotMiddleware from 'koa-webpack-hot-middleware'
import webpack from 'webpack'
import path from 'path'
import { createStore } from 'redux'
import PouchDB from 'pouchdb'

import render from './renderer'
import rootReducer from '../shared/reducers'
import webpackConfig from '../../webpack.client.dev.config'

const app = new Koa()
const router = new KoaRouter()
const compiler = webpack(webpackConfig)

router.get('/bot/:account/:firstOfPair/:secondOfPair/page/*', async (ctx, next) => {
  try {
    const start = new Date()
    const [ , account, currencyOne, currencyTwo ] = ctx.url.match(/\/bot\/(.+)\/(.+)\/(.+)\/page/)
    const dbName = [ account, currencyOne, currencyTwo ].join('_')
    const dbPath = `http://localhost:5984/${dbName}`

    console.log('Use database', dbPath)

    const pouchDB = new PouchDB(dbPath)
    const res = await pouchDB.allDocs({ include_docs: true })
    const state = res.rows.reduce((prev, curr) => Object.assign({}, prev, { [curr.id]: curr.doc.state }), {})
    const store = createStore(rootReducer, state)
    const html = render(store, ctx.url)

    ctx.body = html

    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (err) {
    console.log(err)
  }
})

router.post('/tradingApi', async (ctx, next) => {
  ctx.body = { orderNumber: 31226040, BTC: 0.1, ETH: 3, DASH: 3.1 }
  await next()
})

app.use(webpackDevMiddleware(compiler, { publicPath: '/', noInfo: true }))
app.use(webpackHotMiddleware(compiler))
app.use(router.routes())
app.use(koaStatic(path.join(__dirname, '../public'), { maxage: 1, }))

app.listen(8085)

console.log('app listen 8085')
