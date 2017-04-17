import Koa from 'koa'
import path from 'path'
import koaStatic from 'koa-static'
import { createStore } from 'redux'
import render from './renderer'

import ClientSocket from '../shared/services/clientSocket'
import rootReducer from '../shared/reducers'

const app = new Koa()

app.use(koaStatic(path.join(__dirname, '../public'), { maxage: 1, }))
app.use(async (ctx, next) => {
  try {
    const start = new Date()
    const session = await ClientSocket()
    const state = await session.call('getInitialState')
    const store = createStore(rootReducer, state)
    const html = render(store, ctx.request.url)
    ctx.body = html
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (err) {
    console.log(err)
  }
})

app.listen(8085)

console.log('app listen 8085')
