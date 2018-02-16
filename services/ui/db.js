const r = require('rethinkdb')

const getPositions = async (account) => {
  const conn = await r.connect({ host: 'localhost', port: 28015 })
  const cursor = await r.db('stockbroker')
    .table('positions')
    .getAll(account, { index: 'account' })
    .orderBy(r.row('open')('time'))
    .run(conn)
  return await cursor.toArray()
}

module.exports = { getPositions }
