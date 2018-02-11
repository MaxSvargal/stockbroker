import { delay, periodic } from 'most'
import fetch from 'node-fetch'
import { error } from '../utils/log'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

const requesterProcess = requesterCons({
  name: 'Trade Master Process Requester',
  key: 'processes',
  requests: [ 'processStart' ]
})

const requesterDb = requesterCons({
  name: 'Trade Master Database Requester',
  key: 'db',
  requests: [ 'dbUpdate', 'dbReplaceAll' ]
})

const publisher = publisherCons({
  name: 'Trade Master Signal Publisher',
  broadcasts: [ 'exitFromSymbols' ]
})

const exitProcess = (err: Event) => {
  error(err)
  process.exit(1)
}

const loopStream = delay(5000, periodic(360000))

main(exitProcess, loopStream, fetch, requesterProcess, requesterDb, publisher)
