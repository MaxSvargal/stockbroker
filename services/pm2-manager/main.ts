import { invoker, curry, map, o, props, last, head, both, lt, equals, compose, any, converge, pair, prop } from 'ramda'
import { fromEvent, observe } from 'most'
import { Responder } from 'cote'
import { StartOptions } from 'pm2'

interface PM2 {
  connect: () => void,
  disconnect: () => void,
  start: () => void,
  stop: () => void,
  delete: () => void,
  list: () => void
}

const invokeConnect = invoker(1, 'connect')
const invokeStart = invoker(2, 'start')
const invokeStop = invoker(2, 'stop')
const invokeDelete = invoker(2, 'delete')
const invokeList = invoker(1, 'list')
const invokeDisconnect = invoker(0, 'disconnect')

const mapPidName = o(map(props([ 'pid', 'name' ])), last)
const checkStates = ([ name, list ]: [ string, [ number, string ][] ]) => map(both(o(lt(0), head), o(equals(name), last)), list)
const isAlreadyStarted = compose(any(equals(true)), checkStates, converge(pair, [ head, mapPidName ]))

const connect = (pm2: PM2) => new Promise((resolve, reject) =>
  invokeConnect((err: Error) => err ? reject(err) : resolve())(pm2))

type StartProcess = (a: PM2) => (xs: [ { options: StartOptions }, (b: Error, c: any) => {} ]) => void
const startProcess: StartProcess = pm2 => ([ { options }, reply ]) => {
  invokeList((err: Error, list: any) =>
    isAlreadyStarted([ prop('name', options), list ]) ?
      reply(null, null) :
      invokeStart(options, (err: Error, apps: {}) => reply(err, apps))(pm2)
  )(pm2)
}

type StopProcess = (a: PM2) => (xs: [ { name: string }, (b: Error, c: any) => {} ]) => void
const stopProcess: StopProcess = pm2 => ([ { name }, reply ]) =>
  invokeStop(name, (err: Error) => reply(err, name))(pm2)

type DeleteProcess = (a: PM2) => (xs: [ { name: string }, (b: Error, c: any) => {} ]) => void
const deleteProcess: DeleteProcess = pm2 => ([ { name }, reply ]) =>
  invokeDelete(name, (err: Error) => reply(err, name))(pm2)

type ListProcess = (a: PM2) => (xs: [ Error, (b: Error, c: any) => {} ]) => void
const listProcesses: ListProcess = pm2 => ([ err, reply ]) =>
  invokeList((err: Error, list: any) => reply(err, list))(pm2)

type Main = (a: (a: Event) => void, b: PM2, c: Responder) => void
const main: Main = async (exitProcess, pm2, responder) => {
  try {
    await connect(pm2)
    observe(<any>startProcess(pm2), fromEvent('processStart', responder))
    observe(<any>stopProcess(pm2), fromEvent('processStop', responder))
    observe(<any>deleteProcess(pm2), fromEvent('processDelete', responder))
    observe(<any>listProcesses(pm2), fromEvent('processesList', responder))
  } catch (err) {
    invokeDisconnect(pm2)
    exitProcess(err)
  }
}

export default main
