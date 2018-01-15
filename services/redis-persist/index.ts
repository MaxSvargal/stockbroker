import { constructN } from 'ramda'
import { responderCons } from '../utils/cote'
import { createClient } from 'redis'

import main from './main'

// Options
const name = 'Redis Persist'
const respondsTo = [ 'cacheHashSet', 'cacheHashMultiSet' ]

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const redis = createClient()
const responder = responderCons({ name, respondsTo })

main(exitProcess, redis, responder)
