import r from 'rethinkdb'

r.dbCreate('stockbroker')
r.db('stockbroker').tableCreate('accounts', { primaryKey: 'name' })
r.db('stockbroker').tableCreate('exchangeInfoSymbols', { primaryKey: 'symbol' })
r.db('stockbroker').tableCreate('symbolsState', { primaryKey: 'symbol' })
r.db('stockbroker').tableCreate('positions')
r.db('stockbroker').table('positions').indexCreate('account')
r.db('stockbroker').tableCreate('invites')
r.db('stockbroker').table('invites').indexCreate('code')
r.db('stockbroker').tableCreate('payments')