const cote = require('cote');

const randomRequester = new cote.Requester({
    name: 'Random Requester'
});

const req = {
  type: 'processStart',
  options: {
    name: `Signal Publisher BTGETH`,
    script: './services/signal-publisher/index.ts',
    env: { SYMBOL: 'BTGETH' }
  }
}

randomRequester.send(req, (res) => {
  console.log('request', req, 'answer', res)
})
