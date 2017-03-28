const path = require('path')
const webpack = require('webpack')

const accountConfig = require(path.resolve(__dirname, 'accounts', `${process.env.ACCOUNT}.json`))

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'server/main.js'),
  output: {
    path: path.resolve(__dirname, 'server/build'),
    filename: 'backend.js',
    libraryTarget: 'commonjs'
  },
  externals: [
    'autobahn', 'crypto-js/hmac-sha512', 'jshashes', 'node-fetch',
    'redux', 'redux-act', 'redux-saga', 'redux-saga/effects'
  ],
  resolve: {
    extensions: [ '.js', '.json' ],
    modules: [ 'node_modules', 'src' ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(false),
        ACCOUNT: JSON.stringify(accountConfig)
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
