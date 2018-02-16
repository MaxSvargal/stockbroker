const r = require('rethinkdb')
const { o, compose, flip, invoker, chain, constructN, pick, evolve, converge, always, merge, mergeAll } = require('ramda')

const db = invoker(1, 'db')
const table = invoker(1, 'table')
const filter = invoker(1, 'filter')

// const date = constructN(1, Date)
// const pickTopLevelProps = pick([ 'account', 'symbol' ])
// const pickFromOrderTrade = pick([ 'id', 'time', 'price', 'qty', 'comission', 'comissionAsset', 'orderId', 'origQty' ])
// const evolvePositionProps = evolve({ price: parseFloat, time: date, qty: parseFloat, comission: parseFloat, origQty: parseFloat })
// const makeOpenPositionObj = converge(objOf, [ always('open'), o(evolvePositionProps, pickFromOrderTrade) ])
// const orderTradeToPosition = o(converge(merge, [ pickTopLevelProps, makeOpenPositionObj ]), mergeAll)

const accountsTable = o(table('accounts'), db('stockbroker'))

const main = async () => {
  try {
    const conn = await r.connect({ host: 'localhost', port: 28015 })
    // await r.db('stockbroker').table('positions').indexCreate('account').run(conn)
    // await r.db('stockbroker').tableCreate('accounts', { primaryKey: 'name' }).run(conn)
    // await r.db('stockbroker').tableCreate('positions').run(conn)

    // await r.db('stockbroker').table('positions').get(0).update({ covered: true, coveredBy: { price: '0.0018', quantity: '1.24' } }).run(conn)


    const cursor = await r.db('stockbroker')
      .table('positions')
      .getAll('maxsvargal', { index: 'account' })
      .filter({ symbol: 'WTCBTC' })
      .run(conn)
    const data = await cursor.toArray()
    console.log(data)
    // await accountsTable(r).insert([
    //   { name: 'maxsvargal', preferences: { chunksNumber: 10, minProfit: 0.015 } },
    //   { name: 'lesorub', preferences: { chunksNumber: 6, minProfit: 0.025 } }
    // ]).run(conn)
    // await r.db('stockbroker').table('positions').insert([
    //   { id: 0, account: 'maxsvargal', symbol: 'WTCBTC', price: '0.0015', quantity: '1.25', type: 'BUY' },
    //   { id: 1, account: 'maxsvargal', symbol: 'NEOBTC', price: '0.0012', quantity: '2.12', type: 'SELL' },
    // ]).run(conn)

    // await accountsTable(r).get('maxsvargal').update({ positions: r.row('positions').append({ id: 0, symbol: 'WTCBTC', price: '0.0015', quantity: '1.25', type: 'BUY' }) }).run(conn)
    // const user = await accountsTable(r).get('maxsvargal')('positions').filter({ symbol: 'WTCBTC' }).run(conn)
    // const user = await accountsTable(r)
    //   .get('maxsvargal')('positions')
    //   .filter({ id: 0 })
    //   .update(v => v.merge({ cover: { price: '0.0017', quanity: '1.25', profit: 0.5, date: new Date() } }))
    //   .run(conn)
    // console.log({ user })

    // const res = await r.db('stockbroker').tableCreate('positions').run(conn)
    // const req = await r.db('stockbroker').table('positions').insert([
    //   { id: 0, symbol: 'WTCBTC', price: '0.0015', quantity: '1.25', type: 'BUY' },
    //   { id: 1, symbol: 'NEOBTC', price: '0.0012', quantity: '2.12', type: 'SELL' },
    // ]).run(conn)
    // const bySymbol = r.row('symbol').eq('NEOBTC')
    // const positions = o(filter(bySymbol), positionsTable)
    //
    // const cursor = await positions(r).run(conn)
    // const data = await cursor.toArray()
    // console.log(data)
  } catch (err) {
    console.error(err)
  }
}

main()
