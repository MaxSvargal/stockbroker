const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const child_process = require('child_process')
const config = require('../webpack.config.server')

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.compilation.errors)
  } else {
    console.log('Build done')
    const execPath = path.resolve(config.output.path, config.output.filename)
    const proc = child_process.spawn('node', [ execPath ])

    // write logs on file

    proc.stdout.on('data', (data) => {
      console.log(`${data}`)
    })

    proc.stderr.on('data', (data) => {
      console.log(`Error: ${data}`)
    })

    proc.on('close', (code) => {
      console.log(`Child process exited with code ${code}`)
    })
  }
})
