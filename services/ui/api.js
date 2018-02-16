const cote = require('cote')

const requester = new cote.Requester({
  name: 'Frontend Requester',
  key: 'store-respond',
  requests: [ 'cacheHashGetValues' ]
})

const getPositions = account =>
  requester.send({ type: 'cacheHashGetValues', key: `accounts:${account}:positions` })

module.exports = { getPositions }
