const path = require('path')
const webpack = require('webpack')
const SocketCluster = require('socketcluster').SocketCluster
const webpackConfig = require('../../webpack.config.server')

module.export = webpack(webpackConfig).run((err, stats) => {
  if (err || stats.compilation.errors.length > 0) console.error(err || stats.compilation.errors)
  return new SocketCluster({
    // depending on the Heroku dyno this may vary
    workers: Number(process.env.WEB_CONCURRENCY) || 1,
    // heroku sets the port used on the intranet
    port: process.env.PORT || 5000,
    // everything goes through redux stores
    allowClientPublish: false,
    // generated automatically if using the Heroku deploy button
    authKey: process.env.AUTH_KEY,
    // this process respawns automatically on crash
    workerController: path.resolve(__dirname, 'dist/worker_bundle.js'),
  })
})
