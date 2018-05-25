import { periodic } from 'most'
import * as fetch from 'isomorphic-fetch'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const requester = requesterCons({
  name: 'Signaller Store Requester',
  key: 'db',
  requests: [ 'filterAllRowsConcat' ],
})
const publisher = publisherCons({
  name: 'Signaller Publisher',
  broadcasts: [ 'newSignal' ]
})
const mainLoopStream = periodic(60000)

main(exitProcess, mainLoopStream, requester, publisher, fetch)
