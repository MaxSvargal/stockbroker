const webpack = require('webpack')
const path = require('path')
// const BabiliPlugin = require('babili-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        BROWSER: JSON.stringify(true)
      }
    }),
    // new BabiliPlugin({}, { comments: false })
  ]
}
