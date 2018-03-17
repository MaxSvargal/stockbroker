const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const auth = require('koa-basic-auth')
const mount = require('koa-mount')
const { connect, getPositions, getProfile } = require('./db')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dir: __dirname, dev })
const handle = app.getRequestHandler()

const account = 'maxsvargal'

app.prepare()
.then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/dashboard', async ctx => {
    const conn = await connect()
    const positions = await getPositions(conn)(account)
    const profile = await getProfile(conn)(account)
    await app.render(ctx.req, ctx.res, '/dashboard', { positions, profile })
    ctx.respond = false
  })

  router.get('/b', async ctx => {
    await app.render(ctx.req, ctx.res, '/a', ctx.query)
    ctx.respond = false
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      if (err.status === 401) {
        ctx.status = 401
        ctx.set('WWW-Authenticate', 'Basic')
        ctx.body = 'NaNaNaN Batman!'
      } else {
        throw err
      }
    }
  })
  server.use(mount('/dashboard', auth({ name: 'bullionist', pass: '#bullionist!' })))
  server.use(router.routes())
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
