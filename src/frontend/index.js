import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaStatic from 'koa-static'
import path from 'path'
import { createStore } from 'redux'
import render from './renderer'

import ClientSocket from '../shared/services/clientSocket'
import rootReducer from '../shared/reducers'

const app = new Koa()
const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  ctx.body = 'Show instancies links here'
  await next()
})

router.get('/bot/:account/:firstOfPair/:secondOfPair/page/*', async (ctx, next) => {
  try {
    const start = new Date()
    const session = await ClientSocket()
    const state = await session.call('getInitialState')
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
