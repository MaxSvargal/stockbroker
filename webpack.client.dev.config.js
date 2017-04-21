const path = require('path')
const webpack = require('webpack')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const formatter = require('eslint-formatter-pretty')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: [
      'webpack-hot-middleware/client',
      'client/index.js'
    ],
    vendor: 'client/vendor.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  resolve: {
    extensions: [ '.js', '.json' ],
    modules: [ 'node_modules', 'src' ]
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'eslint-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
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
