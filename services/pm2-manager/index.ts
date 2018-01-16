import { responderCons } from '../utils/cote'
import * as pm2 from 'pm2'

import main from './main'

// Options
const name = 'PM2 Manager'
const respondsTo = [ 'processStart', 'processStop', 'processDelete' ]

// Constructors
const exitProcess = (err: Event) => {
  console.error(err)
  process.exit(1)
}
const responder = responderCons({ name, respondsTo })

main(exitProcess, pm2, responder)
