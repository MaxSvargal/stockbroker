import { periodic } from 'most'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const requesterStore = requesterCons({
  name: 'Signals Killer Store Requester',
  key: 'db',
  requests: [ 'dbGet', 'dbGetAllRowsConcat' ]
})
const requesterProcesses = requesterCons({
  name: 'Signals Killer Processes Requester',
  key: 'processes',
  requests: [ 'processStop' ]
})
const loopStream = periodic(120000)

main(exitProcess, loopStream, requesterStore, requesterProcesses)
