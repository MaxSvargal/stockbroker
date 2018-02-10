const cote = require('cote');

const randomRequester = new cote.Requester({
    name: 'Random Requester',
    key: 'processes'
});

const req1 = {
  type: 'processStart',
  options: {
    name: `Signaller BTCUSDT`,
    script: './services/signal-publisher/index.ts',
    env: { SYMBOL: 'BTCUSDT' }
  }
}
const req2 = {
  type: 'processesList'
}

// setInterval(() => {
//   randomRequester.send(req1, (err, res) => {
//     console.log('request', req1, 'answer', {err,res})
//   })
// }, 5000)

setInterval(() => {
  randomRequester.send(req1, (err, res) => {
    console.log('request', req1, 'answer', res)
  })
}, 10000)
