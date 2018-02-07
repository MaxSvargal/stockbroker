import { subscriberCons, requesterCons, binanceCons } from '../utils/cote'
import main from './main'

const { ACCOUNT, KEY, SECRET } = process.env

const subscriber = subscriberCons({
  name: `Exchange Account ${ACCOUNT}`,
  subscribesTo: [ 'newSignal', 'exitFromSymbols' ]
})

const requester = requesterCons({
  name: `Exchange Account ${ACCOUNT} DB Requester`,
  key: 'db',
  requests: [ 'dbGet', 'dbUpdate', 'dbInsert', 'dbGetAll' ]
})

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({ apiKey: KEY, apiSecret: SECRET })
const account = ACCOUNT

main(exitProcess, binance, subscriber, requester, account)
