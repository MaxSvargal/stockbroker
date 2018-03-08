import { o, head, values, keys, map, prop } from 'ramda'
import { observe, fromEvent, Stream } from 'most'
import { Db, Connection, OperationOptions } from 'rethinkdb'
import { Responder } from 'cote'

type RequestPayload = { table: string, row: string, id: string, by: { string: string }, filter: {}, data: {} | {}[], primaryKey: string }
type RethinkDBConn = (db: Db, conn: Connection) => (a: [ RequestPayload, (err: Error, rows: {}[]) => void ]) => void

const get: RethinkDBConn = (db, conn) => ([ { table, id }, resp ]) =>
  db.table(table).get(id).run(conn, <any>resp)

const getAll: RethinkDBConn = (db, conn) => ([ { table, by, filter }, resp ]) =>
  db.table(table)
    .getAll(o(head, values)(by), { index: o(head, keys)(by) })
    .filter(filter)
    .run(conn, (err, cursor) =>
      err ? resp(err, []) : cursor.toArray(resp))

const count: RethinkDBConn = (db, conn) => ([ { table, by, filter }, resp ]) =>
  db.table(table)
    .getAll(o(head, values)(by), { index: o(head, keys)(by) })
    .filter(filter)
    .count()
    .run(conn, <any>resp)

const getAllRows: RethinkDBConn = (db, conn) => ([ { table, row }, resp ]) =>
  db.table(table).map(a => a(row)).distinct().run(conn, <any>resp)

const filterAllRowsConcat: RethinkDBConn = (db, conn) => ([ { table, filter, row }, resp ]) =>
  db.table(table)
    .filter(filter)
    .map(a => a(row))
    .distinct()
    .run(conn, <any>resp)

  const getAllRowsConcat: RethinkDBConn = (db, conn) => ([ { table, row }, resp ]) =>
  db.table(table).concatMap(a => a(row)).distinct().run(conn, <any>resp)

const insert: RethinkDBConn = (db, conn) => ([ { table, data }, resp ]) =>
  db.table(table).insert(data).run(conn, <any>resp)

const replace: RethinkDBConn = (db, conn) => ([ { table, id, data }, resp ]) =>
  db.table(table).get(id).replace(data).run(conn, <any>resp)

const update: RethinkDBConn = (db, conn) => ([ { table, id, data }, resp ]) =>
  db.table(table).get(id).update(data).run(conn, <any>resp)

const replaceAll: RethinkDBConn = (db, conn) => ([ { table, primaryKey, data }, resp ]) => {
  db.do(map(doc => db.table(table).get(prop(primaryKey, doc)).replace(doc), data)).run(conn, <any>resp)
}

const main = (db: Db, conn: Connection, responder: Responder) => {
  observe(<any>get(db, conn),                   fromEvent('dbGet', responder))
  observe(<any>getAll(db, conn),                fromEvent('dbGetAll', responder))
  observe(<any>getAllRows(db, conn),            fromEvent('dbGetAllRows', responder))
  observe(<any>getAllRowsConcat(db, conn),      fromEvent('dbGetAllRowsConcat', responder))
  observe(<any>filterAllRowsConcat(db, conn),   fromEvent('dbFilterAllRowsConcat', responder))
  observe(<any>insert(db, conn),                fromEvent('dbInsert', responder))
  observe(<any>update(db, conn),                fromEvent('dbUpdate', responder))
  observe(<any>replace(db, conn),               fromEvent('dbReplace', responder))
  observe(<any>replaceAll(db, conn),            fromEvent('dbReplaceAll', responder))
  observe(<any>count(db, conn),                 fromEvent('dbCount', responder))
}

export default main
