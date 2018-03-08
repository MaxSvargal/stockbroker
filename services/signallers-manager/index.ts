import { periodic } from 'most'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const requesterStore = requesterCons({
  name: 'Signallers Manager Store Requester',
  key: 'db',
  requests: [ 'dbGet', 'dbGetAllRowsConcat' ]
})
const requesterProcesses = requesterCons({
  name: 'Signallers Manager Processes Requester',
  key: 'processes',
  requests: [ 'processStop', 'processStart' ]
})
const loopStream = periodic(60000)

main(exitProcess, loopStream, requesterStore, requesterProcesses)
