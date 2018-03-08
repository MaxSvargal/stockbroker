import {
  map, prop, concat, flip, invoker, converge, pair, o, filter, lt, last, reject,
  head, match, compose, not, isNil, uniq, difference, length, equals, flatten
} from 'ramda'
import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import { log } from '../utils/log'

const requestGetActiveSymbols = {
  type: 'dbFilterAllRowsConcat',
  table: 'positions',
  filter: { closed: false },
  row: 'symbol'
}
const requestGetEnabledSymbols = {
  type: 'dbFilterAllRowsConcat',
  table: 'symbolsState',
  filter: { '4h': true, '1h': true, '15m': true },
  row: 'symbol'
}
const requestProcessesList = {
  type: 'processesList'
}
const requestStopSignallerProcess = (symbol: string) => ({
  type: 'processStop',
  name: `Signaller ${symbol}`
})
const requestStartSignallerProcess = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Signaller ${symbol}`,
    script: `./services/signaller/index.ts`,
    max_memory_restart: '120M',
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

const invokeSend = flip(invoker(1, 'send'))
const mapNamePidPair = map(converge(pair, [ prop('name'), prop('pid') ]))
const filterOnlyActive = filter(o(lt(0), last))
const mapSymbolsOfProc = map(compose(last, match(/Signaller\s(.+)/), head))
const removeNils = filter(o(not, isNil))
const getActiveProcSymbols = compose(removeNils, mapSymbolsOfProc, filterOnlyActive, mapNamePidPair)
const lengthIsMoreZero = o(lt(0), length)

type Main = (a: (a: Event) => void, b: Stream<{}>, c: Requester, d: Requester) => void
const main: Main = (exitProcess, loopStream, requesterStore, requesterProcesses) => {
  const store = invokeSend(requesterStore)
  const processes = invokeSend(requesterProcesses)

  const tick = async () => {
    try {
      const [ procList, activeAccountsSymbols, enabledSymbols ] = await Promise.all([
        processes(requestProcessesList),
        store(requestGetActiveSymbols),
        store(requestGetEnabledSymbols)
      ])

      const activeProcesses = getActiveProcSymbols(procList)
      const activeSymbols: string[] = compose(uniq, flatten)([ activeAccountsSymbols, enabledSymbols ])
      const symbolsToStop = difference(activeProcesses, activeSymbols)
      const symbolsToStart = difference(activeSymbols, activeProcesses)

      await Promise.all(concat(
        map(o(processes, requestStopSignallerProcess), symbolsToStop),
        map(o(processes, requestStartSignallerProcess), symbolsToStart)
      ))

      log(`Processes for symbols ${symbolsToStop} successfully stopped.`)
      log(`Processes for symbols ${symbolsToStart} successfully started.`)
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, loopStream)
}

export default main
