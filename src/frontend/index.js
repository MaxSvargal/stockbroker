import Koa from 'koa'
import path from 'path'
import staticCache from 'koa-static-cache'
import { createStore } from 'redux'
import render from './renderer'

import ClientSocket from '../shared/services/clientSocket'
import rootReducer from '../shared/reducers'

const app = new Koa()

app.use(staticCache(path.join(__dirname, '../public'), {
  maxAge: 365 * 24 * 60 * 60,
  buffer: true,
  gzip: true
}))
app.use(async (ctx, next) => {
  const start = new Date()
  const session = await ClientSocket()
  const state = await session.call('getInitialState')
  const store = createStore(rootReducer, state)
  const html = render(store, ctx.request.url)
  ctx.body = html
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.listen(8085)

console.log('app listen 8085')
