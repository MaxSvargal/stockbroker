import { constructN } from 'ramda'
import { subscriberCons } from '../utils/cote'
import { createClient } from 'redis'

import main from './main'

// Options
const name = 'Redis Persist Subscriber'
const subscribesTo = [ 'storeSet', 'storeUpdate' ]

// Constructors
const exitProcess = () => process.exit(1)
const redis = createClient()
const subscriber = subscriberCons({ name, subscribesTo })

main(exitProcess, redis, subscriber)
