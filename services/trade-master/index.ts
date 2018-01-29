import { delay, periodic } from 'most'
import fetch from 'node-fetch'
import { error } from '../utils/log'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

// Constructors
const requesterPersistStore = requesterCons({
  name: 'Trade Master Persist Store Requester',
  key: 'store-persist',
  requests: [ 'cacheHashSet', 'cacheHashMultiSet' ]
})

const requesterProcess = requesterCons({
  name: 'Trade Master Process Requester',
  key: 'processes',
  requests: [ 'processStart' ]
})

const publisher = publisherCons({
  name: 'Trade Master Signal Publisher',
  broadcasts: [ 'exitFromSymbols' ]
})


const exitProcess = (err: Event) => {
  error(err)
  // process.exit(1)
}

const loopStream = delay(5000, periodic(200000))

main(exitProcess, loopStream, fetch, requesterPersistStore, requesterProcess, publisher)
