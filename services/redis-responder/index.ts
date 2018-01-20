import { constructN } from 'ramda'
import { responderCons } from '../utils/cote'
import { createClient } from 'redis'

import main from './main'

// Options
const name = 'Redis Responder'
const key = 'store-respond'
const respondsTo = [ 'cacheHashGet', 'cacheHashGetValues' ]

// Constructors
const exitProcess = () => process.exit(1)
const redis = createClient()
const responder = responderCons({ name, key, respondsTo })

main(exitProcess, redis, responder)
