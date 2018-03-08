import { delay, periodic } from 'most'
import fetch from 'node-fetch'
import { error } from '../utils/log'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

const requesterDb = requesterCons({
  name: 'Trade Master Database Requester',
  key: 'db',
  requests: [ 'dbUpdate', 'dbReplaceAll', 'dbReplace', 'dbGet' ]
})

const exitProcess = (err: Event) => {
  error(err)
  process.exit(1)
}

const loopStream = delay(2000, periodic(120000))

main(exitProcess, loopStream, fetch, requesterDb)
