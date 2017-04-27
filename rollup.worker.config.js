const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
  entry: 'src/worker/index.js',
  dest: 'dist/worker_bundle.js',
  format: 'cjs',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      modulesOnly: true,
      jail: `${__dirname}/src/`,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs({
      exclude: [ 'node_modules/**' ],
      sourceMap: true
    })
  ]
}
