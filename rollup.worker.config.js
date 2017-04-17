const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
  entry: 'src/worker/index.js',
  dest: 'dist/worker_bundle.js',
  format: 'cjs',
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      main: true,
      preferBuiltins: false,
      jail: 'src'
    }),
    commonjs({
      exclude: [ 'node_modules' ],
      sourceMap: true
    })
  ]
}
