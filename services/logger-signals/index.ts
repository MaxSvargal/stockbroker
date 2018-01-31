import { subscriberCons, requesterCons } from '../utils/cote'
import main from './main'

const subscriber = subscriberCons({
  name: 'Test Signals Subscriber',
  subscribesTo: [ 'newSignal', 'exitFromSymbols' ]
})

const preserver = requesterCons({
  name: 'Test Signals Preserver',
  key: 'store-persist',
  requests: [ 'cacheHashSet' ]
})

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}

main(exitProcess, subscriber, preserver)
