const cote = require('cote');

const randomRequester = new cote.Requester({
  name: 'DB Tester',
  key: 'db',
  requests: [ 'dbGetAll' ]
});

const req = {
  type: 'dbGetAll',
  table: 'positions',
  by: { account: 'maxsvargal' },
  filter: { symbol: 'WTCBTC' }
}

const reqInsert = {
  type: 'dbInsert',
  table: 'positions',
  data: {
    account: 'maxsvargal',
    symbol: 'DEMO'
  }
}

const reqUpdate = {
  type: 'dbUpdate',
  table: 'positions',
  id: 'd17bef88-35de-44ba-aba5-d1a403e30252',
  data: {
    account: 'maxsvargal',
    symbol: 'DEMO2',
    some: 'another'
  }
}

setInterval(() => {
  console.log('send')
  randomRequester.send(reqUpdate, (err, res) => {
    console.log('request', req, 'answer', res)
  })
}, 5000)
