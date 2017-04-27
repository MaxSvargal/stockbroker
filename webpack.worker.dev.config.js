const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/worker/index.js',
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'sourcemap',
  externals: [ nodeExternals() ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'worker_dev_bundle.js'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ]
}
