import { o, head, values, keys } from 'ramda'
import { observe, fromEvent, Stream } from 'most'
import { Db, Connection, OperationOptions } from 'rethinkdb'
import { Responder } from 'cote'

type RequestPayload = { table: string, row: string, id: string, by: { string: string }, filter: {}, data: {} | {}[] }
type RethinkDBConn = (db: Db, conn: Connection) => (a: [ RequestPayload, (err: Error, rows: {}[]) => void ]) => void

const get: RethinkDBConn = (db, conn) => ([ { table, id }, resp ]) =>
  db.table(table).get(id).run(conn, <any>resp)

const getAll: RethinkDBConn = (db, conn) => ([ { table, by, filter }, resp ]) => {
  db.table(table)
    .getAll(o(head, values)(by), { index: o(head, keys)(by) })
    .filter(filter)
    .run(conn, (err, cursor) =>
      err ? resp(err, []) : cursor.toArray(resp))
}

const count: RethinkDBConn = (db, conn) => ([ { table, by, filter }, resp ]) => {
  db.table(table)
    .getAll(o(head, values)(by), { index: o(head, keys)(by) })
    .filter(filter)
    .count()
    .run(conn, <any>resp)
}

const getAllRows: RethinkDBConn = (db, conn) => ([ { table, row }, resp ]) =>
  db.table(table).map(a => a(row)).distinct().run(conn, <any>resp)

const getAllRowsConcat: RethinkDBConn = (db, conn) => ([ { table, row }, resp ]) =>
  db.table(table).concatMap(a => a(row)).distinct().run(conn, <any>resp)

const insert: RethinkDBConn = (db, conn) => ([ { table, data }, resp ]) =>
  db.table(table).insert(data).run(conn, <any>resp)

const update: RethinkDBConn = (db, conn) => ([ { table, id, data }, resp ]) =>
  db.table(table).get(id).update(data).run(conn, <any>resp)

const main = (db: Db, conn: Connection, responder: Responder) => {
  observe(<any>get(db, conn),               fromEvent('dbGet', responder))
  observe(<any>getAll(db, conn),            fromEvent('dbGetAll', responder))
  observe(<any>getAllRows(db, conn),        fromEvent('getAllRows', responder))
  observe(<any>getAllRowsConcat(db, conn),  fromEvent('getAllRowsConcat', responder))
  observe(<any>insert(db, conn),            fromEvent('dbInsert', responder))
  observe(<any>update(db, conn),            fromEvent('dbUpdate', responder))
  observe(<any>count(db, conn),             fromEvent('dbCount', responder))
}

export default main
