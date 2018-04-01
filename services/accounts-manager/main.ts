import {
  map, prop, concat, flip, invoker, converge, pair, o, filter, lt, last, reject,
  head, match, compose, not, isNil, uniq, difference, length, equals, flatten, propEq
} from 'ramda'
import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import { log } from '../utils/log'

const requestProcessesList = {
  type: 'processesList',
}
const requestGetAccounts = {
  type: 'dbGetAllPluck',
  table: 'accounts',
  pluck: [ 'name', 'enabled' ],
}
const requestStopProcess = (name: string) => ({
  type: 'processStop',
  name: `Account ${name}`,
})
const requestStartProcess = (name: string) => ({
  type: 'processStart',
  options: {
    name: `Account ${name}`,
    script: `./services/exchange-account/index.ts`,
    max_memory_restart: '120M',
    env: { ACCOUNT: name, DEBUG: 'app:log,app:error' },
  },
})

const invokeSend = flip(invoker(1, 'send'))
const mapNamePidPair = map(converge(pair, [ prop('name'), prop('pid') ]))
const filterOnlyActive = filter(o(lt(0), last))
const mapNamesOfProc = map(compose(last, match(/Account\s(.+)/), head))
const removeNils = filter(o(not, isNil))

const getActiveProcAccounts: (a: {}[]) => string[] = compose(removeNils, mapNamesOfProc, filterOnlyActive, mapNamePidPair) as any
const getEnabled: (a: {}[]) => string[] = o(map(prop('name')), filter(propEq('enabled', true))) as any

type Main = (a: (a: Event) => void, b: Stream<{}>, c: Requester, d: Requester) => void
const main: Main = (exitProcess, loopStream, requesterStore, requesterProcesses) => {
  const store: (req: {}) => Promise<{}[]> = invokeSend(requesterStore) as any
  const processes: (req: {}) => Promise<{}[]> = invokeSend(requesterProcesses) as any

  const tick = async () => {
    try {
      const [ procList, accounts ] = await Promise.all([
        processes(requestProcessesList),
        store(requestGetAccounts)
      ])

      const activeProcesses = getActiveProcAccounts(procList)
      const enabledAccounts = getEnabled(accounts)
      const toStart = difference(enabledAccounts, activeProcesses)
      const toStop = difference(activeProcesses, enabledAccounts)

      await Promise.all(concat(
        map(o(processes, requestStopProcess), toStop),
        map(o(processes, requestStartProcess), toStart)
      ))

      log(`Processes for accounts ${toStop} successfully stopped.`)
      log(`Processes for accounts ${toStart} successfully started.`)
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, loopStream)
}

export default main
