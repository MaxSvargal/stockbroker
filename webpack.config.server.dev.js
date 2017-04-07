const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

/* eslint import/no-dynamic-require: 0 */
const accountPath = path.resolve(__dirname, 'src/server/accounts', `${process.env.ACCOUNT}.json`)
const accountConfig = require(accountPath)

module.exports = {
  context: path.resolve(__dirname, 'src'),
  target: 'node',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/server/dev-worker'),
  output: {
    path: path.resolve(__dirname, 'server/dist'),
    publicPath: path.resolve(__dirname, 'src/server'),
    filename: 'worker_bundle.js',
    libraryTarget: 'commonjs'
  },
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [
    nodeExternals()
  ],
  resolve: {
    extensions: [ '.js', '.json' ],
    modules: [ 'node_modules', 'src' ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(false),
        ACCOUNT: JSON.stringify(accountConfig),
        CURRENCY_PAIR: JSON.stringify(process.env.CURRENCY_PAIR),
        DB_PATH: JSON.stringify(process.env.DB_PATH)
      }
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
    new webpack.IgnorePlugin(/vertx/)
  ]
}