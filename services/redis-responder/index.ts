import { constructN } from 'ramda'
import { responderCons } from '../utils/cote'
import { createClient } from 'redis'

import main from './main'

// Options
const name = 'Redis Responder'
const respondsTo = [ 'storeGetAll' ]

// Constructors
const exitProcess = () => process.exit(1)
const redis = createClient()
const responder = responderCons({ name, respondsTo })

main(exitProcess, redis, responder)
