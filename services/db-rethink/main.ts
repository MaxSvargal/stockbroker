import { o, head, values, keys, map, prop } from 'ramda'
import { observe, fromEvent } from 'most'
import { Db, Connection, OperationOptions } from 'rethinkdb'
import { Responder } from 'cote'

type RequestPayload = {
  table: string,
  row: string,
  id: string,
  by: { string: string },
  filter: {},
  pluck: string[],
  data: {} | {}[],
  primaryKey: string
}
type RethinkDBConn = (db: Db, conn: Connection) => (a: [ RequestPayload, OperationOptions ]) => void

const get: RethinkDBConn = (db, conn) => ([ { table, id }, resp ]) =>
  db.table(table)
    .get(id)
    .run(conn, resp)

const getAllPluck: RethinkDBConn = (db, conn) => ([ { table, pluck }, resp ]) =>
  db.table(table)
    .pluck(...pluck)
    .orderBy(head(pluck) as string)
    .run(conn, resp)

const filterBy: RethinkDBConn = (db, conn) => ([ { table, by, filter }, resp ]) =>
  db.table(table)
    .getAll(o(head, values, by), { index: o(head, keys, by) })
    .filter(filter)
    .orderBy(o(head, keys, by))
    .run(conn, resp)

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
  observe(<any>getAllPluck(db, conn),           fromEvent('dbGetAllPluck', responder))
  observe(<any>filterBy(db, conn),              fromEvent('dbFilterBy', responder))
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
