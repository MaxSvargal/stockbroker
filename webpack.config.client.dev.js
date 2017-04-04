const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const formatter = require('eslint-formatter-pretty')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    vendor: 'client/vendor.js',
    main: 'client/index.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  resolve: {
    extensions: [ '.js', '.json' ],
    modules: [ 'node_modules', 'src' ]
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'eslint-loader' }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true)
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Poloniex Bot',
      template: 'client/template.html',
      cache: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: [ 'vendor', 'manifest' ],
      minChunks: Infinity,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: { formatter }
      }
    })
  ]
}
