import {
  map, prop, concat, flip, invoker, converge, pair, o, filter, lt, last, reject,
  head, match, compose, not, isNil, uniq, difference, length, equals, flatten
} from 'ramda'
import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import { log } from '../utils/log'

const invokeSend = flip(invoker(1, 'send'))
const requestGetActiveSymbols = { type: 'dbGetAllRowsConcat', table: 'accounts', row: 'activeSymbols' }
const requestGetEnabledSymbols = { type: 'dbGet', table: 'tradeState', id: 'symbolsEnabled' }
const requestProcessesList = { type: 'processesList' }
const requestStopSignallerProcess = (symbol: string) => ({ type: 'processStop', name: `Signaller ${symbol}` })

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
      const [ procList, usersSymbols, { values: enabledSymbols } ] = await Promise.all([
        processes(requestProcessesList),
        store(requestGetActiveSymbols),
        store(requestGetEnabledSymbols)
      ])

      const activeProcesses = getActiveProcSymbols(procList)
      const activeSymbols: string[] = compose(uniq, flatten)([ usersSymbols, enabledSymbols ])
      const symbolsToStop = difference(activeProcesses, activeSymbols)

      log({ activeSymbols, symbolsToStop })

      if(lengthIsMoreZero(symbolsToStop)) {
        await Promise.all(map(o(processes, requestStopSignallerProcess), symbolsToStop))
        log(`Processes for symbols ${symbolsToStop} successfully stoped.`)
      }
      log('No targets to kill')
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, loopStream)
}

export default main
