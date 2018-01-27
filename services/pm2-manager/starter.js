const cote = require('cote')

const requester = new cote.Requester({
  name: 'Process Starter',
  key: 'processes',
  requests: [ 'processStart' ]
})

const processStartSignallerRequest = symbol => ({
  type: 'processStart',
  options: {
    name: `Signaller ${symbol}`,
    script: `./services/signaller/index.ts`,
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

const symbols = process.argv.slice(2)

symbols.forEach(val =>
  requester.send(processStartSignallerRequest(val)))

setTimeout(() => {
  console.log(`All symbols ${symbols} was started. Buy buy.`)
  process.exit(1)
}, 5000)
