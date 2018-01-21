import {
  map, prop, concat, flip, invoker, converge, pair, o, filter, lt, last, reject,
  head, match, compose, not, isNil, uniq, unnest, difference, length, equals
} from 'ramda'
import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import debug from 'debug'

const invokeSend = flip(invoker(1, 'send'))
const requestGetActiveSymbols = { type: 'cacheHashGetValues', key: 'accounts:activeSymbols' }
const requestGetCurrentSymbol = { type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol' }
const requestProcessesList = { type: 'processesList' }
const requestStopSigProcess = (symbol: string) => ({ type: 'processStop', name: `Signal Publisher ${symbol}` })
const requestStopLisProcess = (symbol: string) => ({ type: 'processStop', name: `Binance Exchange Listener ${symbol}` })

const mapNamePidPair = map(converge(pair, [ prop('name'), prop('pid') ]))
const filterOnlyActive = filter(o(lt(0), last))
const mapSymbolsOfProc = map(compose(last, match(/Signal Publisher\s(.+)/), head))
const removeNils = filter(o(not, isNil))
const getActiveProcSymbols = compose(removeNils, mapSymbolsOfProc, filterOnlyActive, mapNamePidPair)
const getUsersSymbols: (a: string[]) => string[] = compose(<any>uniq, unnest, <any>map(JSON.parse))
const lengthIsMoreZero = o(lt(0), length)

type Main = (a: (a: Event) => void, b: Stream<{}>, c: Requester, d: Requester) => void
const main: Main = (exitProcess, loopStream, requesterStore, requesterProcesses) => {
  const store = invokeSend(requesterStore)
  const processes = invokeSend(requesterProcesses)

  const tick = async () => {
    try {
      const procList = await processes(requestProcessesList)
      const usersSymbols = await store(requestGetActiveSymbols)
      const currentSymbol = await store(requestGetCurrentSymbol)

      const activeProcesses = getActiveProcSymbols(procList)
      const activeSymbols: string[] = getUsersSymbols(usersSymbols)
      const diffOfActivities = difference(activeProcesses, activeSymbols)
      const symbolsToStop = reject(equals(currentSymbol), diffOfActivities)

      if(lengthIsMoreZero(symbolsToStop)) {
        await Promise.all(concat(
          map(o(processes, requestStopSigProcess), symbolsToStop),
          map(o(processes, requestStopLisProcess), symbolsToStop)
        ))
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