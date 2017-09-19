const { execSync } = require('child_process')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const jest = require('gulp-jest').default
const flowRemoveTypes = require('gulp-flow-remove-types')

// const Cache = require('gulp-file-cache')
// const cache = new Cache()

gulp.task('compile', () =>
  gulp.src('./src/worker/**/*.mjs')
    // .pipe(cache.filter())
    .pipe(flowRemoveTypes({ pretty: true, sourceMap: true }))
    // .pipe(cache.cache())
    .pipe(gulp.dest('./build')))

gulp.task('flow', () => {
  try {
    execSync('./node_modules/.bin/flow', { stdio: 'inherit' })
  } catch (e) {
    /* eslint no-console: 0 */
    if (!e.message.match(new RegExp('Command failed', 'i'))) console.log(e)
    gulp.stop()
  }
})

gulp.task('jest', () =>
  gulp.src('./test')
    .pipe(jest({
      preprocessorIgnorePatterns: [
        './dist/', './node_modules/'
      ],
      moduleFileExtensions: [
        'js', 'mjs'
      ],
      testMatch: [
        '**/__tests__/**/*.js?(x)',
        '**/?(*.)(spec|test).mjs',
        '**/test/*.mjs'
      ],
      automock: false
    })))

gulp.task('watch', () => nodemon({
  script: 'build/',
  watch: './src',
  ext: 'mjs',
  nodeArgs: [ '--experimental-modules' ],
  env: {
    DEBUG: '*',
    NODE_ENV: 'development',
    ACCOUNT: 'maxsvargal',
    PAIR: 'ETH_BTC'
  },
  tasks: [ 'compile' ]
}))

gulp.task('default', [ 'flow', 'compile', 'watch' ])
