import { constructN } from 'ramda'
import { responderCons } from '../utils/cote'
import { createClient } from 'redis'

import main from './main'

// Options
const name = 'Redis Persist'
const key = 'store-persist'
const respondsTo = [ 'cacheHashSet', 'cacheHashMultiSet' ]

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const redis = createClient()
const responder = responderCons({ name, key, respondsTo })

main(exitProcess, redis, responder)
