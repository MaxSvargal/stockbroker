import { subscriberCons, requesterCons, binanceCons } from '../utils/cote'
import main from './main'

const {
  ACCOUNT = 'maxsvargal',
  KEY = 'ZtgjgCPqiKw80Y7M2BwzNjl2XspqiUCxWx5v1fRgDAnkWPhSpT5yNzbuaOT2SiqI',
  SECRET = '8VP3B4wtMJcuGjWyDDwVDkZoeI16Z8pALYo2LDqXZm1loMKkVzmCkdbXrakdmXBC'
} = process.env

const subscriber = subscriberCons({
  name: `Binance Exchange Account ${ACCOUNT}`,
  subscribesTo: [ 'newSignal' ]
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
