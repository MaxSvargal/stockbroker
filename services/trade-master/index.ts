import { periodic } from 'most'
import { requesterCons, publisherCons } from '../utils/cote'
import fetch from 'node-fetch'

import main from './main'

// Options
const name = 'Trade Master'
const requests = [ 'storeGetAll' ]

// Constructors
const exitProcess = (err: Event) => {
  console.error(err)
  process.exit(1)
}
const requester = requesterCons({ name, requests })
// const publisher = publisherCons({ name, broadcasts })
const loopStream = periodic(30000)
//
main(exitProcess, loopStream, fetch, requester)
