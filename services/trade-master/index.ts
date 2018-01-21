import { delay, periodic } from 'most'
import { requesterCons, publisherCons } from '../utils/cote'
import fetch from 'node-fetch'

import main from './main'

// Constructors
const requesterPersistStore = requesterCons({
  name: 'Trade Master Persist Store Requester',
  key: 'store-persist',
  requests: [ 'cacheHashSet', 'cacheHashMultiSet' ]
})

const requesterRespondStore = requesterCons({
  name: 'Trade Master Respond Store Requester',
  key: 'store-respond',
  requests: [ 'cacheHashGet', 'cacheHashGetValues' ]
})

const requesterProcess = requesterCons({
  name: 'Trade Master Process Requester',
  key: 'processes',
  requests: [ 'processStart' ]
})

const exitProcess = (err: Event) => {
  console.error(err)
  process.exit(1)
}

const loopStream = delay(5000, periodic(600000))

main(exitProcess, loopStream, fetch, requesterPersistStore, requesterRespondStore, requesterProcess)
