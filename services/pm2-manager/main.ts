import { invoker, curry } from 'ramda'
import { fromEvent, observe } from 'most'
import { Responder } from 'cote'
import { StartOptions } from 'pm2'

interface PM2 {
  connect: () => void,
  disconnect: () => void,
  start: () => void,
  stop: () => void,
  delete: () => void
}

const invokeConnect = invoker(1, 'connect')
const invokeStart = invoker(2, 'start')
const invokeStop = invoker(2, 'stop')
const invokeDelete = invoker(2, 'delete')
const invokeDisconnect = invoker(0, 'disconnect')

const connect = (pm2: PM2) => new Promise((resolve, reject) =>
  invokeConnect((err: Error) => err ? reject(err) : resolve())(pm2))

type StartProcess = (a: PM2) => (xs: [ { options: StartOptions }, (b: Error, c: any) => {} ]) => void
const startProcess: StartProcess = pm2 => ([ { options }, reply ]) =>
  invokeStart(options, (err: Error, apps: {}) => reply(err, apps))(pm2)

type StopProcess = (a: PM2) => (xs: [ { name: string }, (b: Error, c: any) => {} ]) => void
const stopProcess: StopProcess = pm2 => ([ { name }, reply ]) =>
  invokeStop(name, (err: Error) => reply(err, name))(pm2)

type DeleteProcess = (a: PM2) => (xs: [ { name: string }, (b: Error, c: any) => {} ]) => void
const deleteProcess: DeleteProcess = pm2 => ([ { name }, reply ]) =>
  invokeDelete(name, (err: Error) => reply(err, name))(pm2)

type Main = (a: (a: Event) => void, b: PM2, c: Responder) => void
const main: Main = async (exitProcess, pm2, responder) => {
  try {
    await connect(pm2)
    observe(<any>startProcess(pm2), fromEvent('processStart', responder))
    observe(<any>startProcess(pm2), fromEvent('processStop', responder))
    observe(<any>deleteProcess(pm2), fromEvent('processDelete', responder))
  } catch (err) {
    invokeDisconnect(pm2)
    exitProcess(err)
  }
}

export default main
