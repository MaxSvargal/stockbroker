const r = require('rethinkdb')
const connect = async () => await r.connect({ host: 'localhost', port: 28015 }) 

const getPositions = (conn) => async (account) => {
  const cursor = await r.db('stockbroker')
    .table('positions')
    .getAll(account, { index: 'account' })
    .orderBy(r.row('open')('time'))
    .run(conn)
  return await cursor.toArray()
}

const getProfile = (conn) => async (account) =>
  await r.db('stockbroker')
    .table('accounts')
    .get(account)
    .run(conn)

module.exports = { connect, getPositions, getProfile }
