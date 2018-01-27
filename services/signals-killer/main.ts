import {
  map, prop, concat, flip, invoker, converge, pair, o, filter, lt, last, reject,
  head, match, compose, not, isNil, uniq, difference, length, equals, flatten
} from 'ramda'
import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import debug from 'debug'

const invokeSend = flip(invoker(1, 'send'))
const requestGetActiveSymbols = { type: 'cacheHashGetValues', key: 'accounts:activeSymbols' }
const requestGetEnabledSymbols = { type: 'cacheHashGet', key: 'tradeState', field: 'enabledToBuySymbols' }
const requestProcessesList = { type: 'processesList' }
const requestStopSignallerProcess = (symbol: string) => ({ type: 'processStop', name: `Signaller ${symbol}` })

const parse = flip(invoker(1, 'parse'))(JSON)
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
      const [ procList, usersSymbolsRaw, enabledSymbolsRaw ] = await Promise.all([
        processes(requestProcessesList),
        store(requestGetActiveSymbols),
        store(requestGetEnabledSymbols)
      ])

      const activeProcesses = getActiveProcSymbols(procList)
      const activeSymbols: string[] = compose(uniq, flatten)([ map(parse, usersSymbolsRaw), parse(enabledSymbolsRaw) ])
      const symbolsToStop = difference(activeProcesses, activeSymbols)

      if(lengthIsMoreZero(symbolsToStop)) {
        await Promise.all(map(o(processes, requestStopSignallerProcess), symbolsToStop))
        debug('dev')(`Processes for symbols ${symbolsToStop} successfully stoped.`)
      }
      debug('dev')('No targets to kill')
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, loopStream)
}

export default main
