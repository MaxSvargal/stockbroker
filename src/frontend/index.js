import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaStatic from 'koa-static'
import path from 'path'
import { createStore } from 'redux'
import pm2 from 'pm2'
import PouchDB from 'pouchdb'
import PouchDBMemory from 'pouchdb-memory'

import render from './renderer'
import monitor from './monitor'

import rootReducer from '../shared/reducers'

const app = new Koa()
const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  try {
    await new Promise((resolve, reject) =>
      pm2.connect(err => err ? reject(err) : resolve()))
    const processList = await new Promise((resolve, reject) =>
      pm2.list((err, list) => err ? reject(err) : resolve(list)))

    const html = monitor(processList)
    ctx.body = html
  } catch (err) {
    console.error(err)
  }
  await next()
})

router.get('/bot/:account/:firstOfPair/:secondOfPair/page/*', async (ctx, next) => {
  try {
    const start = new Date()
    const [ , account, currencyOne, currencyTwo ] = ctx.url.match(/\/bot\/(.+)\/(.+)\/(.+)\/page/)
    const dbName = [ account, currencyOne.toUpperCase(), currencyTwo.toUpperCase() ].join('_')
    console.log('Use database', dbName)
    // Get full state from database
    const localDb = new PouchDB(`../server/db/${dbName}`)
    // const memoryDb = new PouchDBMemory('local')
    // await memoryDb.replicate.from(localDb)
    console.log({ localDb })
    // const pouchDB = new PouchDB(`http://localhost:5984/${dbName}`)
    const res = await localDb.allDocs({ include_docs: true })
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

app.use(router.routes())
app.use(koaStatic(path.join(__dirname, '../public'), { maxage: 1, }))

app.listen(8085)

console.log('app listen 8085')
