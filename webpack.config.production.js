const path = require('path')
const BabiliPlugin = require('babili-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.js',
  context: path.resolve(__dirname, 'src'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: [ '.js', '.json' ],
    modules: [ 'node_modules', 'src' ]
  },
  devtool: 'source-map',
  plugins: [
    // new HtmlWebpackPlugin({ title: 'PoloniexBot' })
    new BabiliPlugin()
  ]
}
