const webpack = require('webpack')
const path = require('path')
const BabiliPlugin = require('babili-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

/* eslint import/no-dynamic-require: 0 */
const accountPath = path.resolve(__dirname, 'src/server/accounts', `${process.env.ACCOUNT}.json`)
const { pair } = require(accountPath)

module.exports = {
  entry: 'client/index.js',
  context: path.resolve(__dirname, 'src'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public'
  },
  resolve: {
    extensions: [ '.js', '.json' ],
    modules: [ 'node_modules', 'src' ]
  },
  devtool: 'source-map',
  plugins: [
    // new HtmlWebpackPlugin({ title: 'PoloniexBot' })
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
        ACCOUNT: JSON.stringify({ pair })
      }
    }),
    new BabiliPlugin({}, { comments: false })
  ]
}
