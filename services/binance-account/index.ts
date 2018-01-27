import { subscriberCons, requesterCons, binanceCons } from '../utils/cote'
import main from './main'

const { ACCOUNT, KEY, SECRET } = process.env

const subscriber = subscriberCons({
  name: `Binance Exchange Account ${ACCOUNT}`,
  subscribesTo: [ 'newSignal', 'exitFromSymbols' ]
})

const requesterRespondStore = requesterCons({
  name: `Exchange Account ${ACCOUNT} Respond Store Requester`,
  key: 'store-respond',
  requests: [ 'cacheHashGet', 'cacheHashGetValues' ]
})

const requesterPersistStore = requesterCons({
  name: `Exchange Account ${ACCOUNT} Persist Store Requester`,
  key: 'store-persist',
  requests: [ 'cacheHashSet' ]
})

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({ apiKey: KEY, apiSecret: SECRET })
const account = ACCOUNT

main(exitProcess, binance, subscriber, requesterRespondStore, requesterPersistStore, account)
