const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const formatter = require('eslint-formatter-pretty')

const accountConfig = require(path.resolve(__dirname, 'accounts', `${process.env.ACCOUNT}.json`))

module.exports = {
  entry: {
    vendor: './vendor.js',
    main: './index.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  context: path.resolve(__dirname, 'src'),
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
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true),
        ACCOUNT: JSON.stringify(accountConfig)
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Poloniex Bot',
      template: 'template.html',
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
