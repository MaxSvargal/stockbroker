import { constructN } from 'ramda'
import { responderCons } from '../utils/cote'
import * as r from 'rethinkdb'

import main from './main'

const responder = responderCons({
  name: 'DB Rethink',
  key: 'db',
  respondsTo: [ 'dbGet', 'dbGetAll', 'dbInsert', 'dbUpdate', 'dbCount' ]
})

r.connect({
  host: 'localhost',
  port: 28015,
  db: 'stockbroker'
}, (err, conn) => {
  if (err) throw err
  else main(<any>r, conn, responder)
})
