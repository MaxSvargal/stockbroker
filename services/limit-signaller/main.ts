import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import { curry, flip, invoker, map, o, concat, zip, prop, groupBy, converge, always, assoc, identity } from 'ramda'
import { log, error } from '../utils/log'

const requrestAccounts = {
  type: 'dbFilter',
  table: 'accounts',
  filter: { preferences: { sellLimit: true } }
}
const requestOpenedPositions = {
  type: 'dbFilter',
  table: 'positions',
  filter: { closed: false },
}

const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')
const invokePublishNewSignal = flip(invokePublish('newSignal'))

const fetchTicker = (fetch: Function) =>
  fetch('https://binance.com/api/v3/ticker/price')
    .then((res: Response) => res.json())
    .catch((err: Error) => console.error(err))

type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: Requester, d: Publisher, e: Function) => void

const main: Main = (exitProcess, mainLoopStream, requester, publisher, fetch) => {
  const publishSignals = map(invokePublishNewSignal(publisher))
  const request = invokeSend(requester) as (a: {}) => Promise<any>

  const iterate = async () => {
    try {
      const [ ticker, accounts, positions ] = await Promise.all([
        fetchTicker(fetch),
        request(requrestAccounts),
        request(requestOpenedPositions)
      ])

      const groupedPositions = groupBy(prop('account'), positions)

      const compiledAccounts = map(converge(assoc, [
        always('positions'),
        converge(prop, [ prop('name'), always(groupedPositions) ]),
        identity
      ]), accounts)

      console.log(compiledAccounts[0].positions)
    } catch (err) {
      error(err)
      return exitProcess(err)
    }
  }

  observe(iterate, mainLoopStream)
}

export default main
