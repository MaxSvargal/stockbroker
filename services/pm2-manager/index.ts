import { responderCons } from '../utils/cote'
import * as pm2 from 'pm2'

import main from './main'

// Options
const name = 'PM2 Manager'
const key = 'processes'
const respondsTo = [ 'processStart', 'processStop', 'processDelete', 'processesList' ]

// Constructors
const exitProcess = (err: Event) => {
  console.error(err)
  process.exit(1)
}
const responder = responderCons({ name, key, respondsTo })

main(exitProcess, pm2, responder)
