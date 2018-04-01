import { periodic } from 'most'
import { requesterCons } from '../utils/cote'
import * as r from 'rethinkdb'

import main from './main'

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const requesterStore = requesterCons({
  name: 'Accounts Starter Store Requester',
  key: 'db',
  requests: [ 'dbGetAllPluck' ],
})

const requesterProcesses = requesterCons({
  name: 'Accounts Starter Processes Requester',
  key: 'processes',
  requests: [ 'processStop', 'processStart' ],
})
const loopStream = periodic(60000)

main(exitProcess, loopStream, requesterStore, requesterProcesses)
