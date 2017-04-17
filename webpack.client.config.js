const webpack = require('webpack')
const path = require('path')
// const BabiliPlugin = require('babili-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, 'src/client'),
  entry: './index.js',
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true)
      }
    }),
    // new BabiliPlugin({}, { comments: false })
  ]
}