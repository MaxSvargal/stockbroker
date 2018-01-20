import { subscriberCons, requesterCons, binanceCons } from '../utils/cote'
import main from './main'

const {
  ACCOUNT = 'maxsvargal',
  KEY = 'ZtgjgCPqiKw80Y7M2BwzNjl2XspqiUCxWx5v1fRgDAnkWPhSpT5yNzbuaOT2SiqI',
  SECRET = '8VP3B4wtMJcuGjWyDDwVDkZoeI16Z8pALYo2LDqXZm1loMKkVzmCkdbXrakdmXBC'
} = process.env
const name = `Binance Exchange Account ${ACCOUNT}`
const subscribesTo = [ 'newSignal' ]
const requests = [ 'cacheHashGet', 'cacheHashGetValues' ]
const key = 'store-respond'

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({ apiKey: KEY, apiSecret: SECRET })
const subscriber = subscriberCons({ name, subscribesTo })
const requester = requesterCons({ name, key, requests })
const account = ACCOUNT

main(exitProcess, binance, subscriber, requester, account)
