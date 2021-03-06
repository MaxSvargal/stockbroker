import { o, map, props, prop } from 'ramda'
import { periodic } from 'most'
import { subscriberCons, requesterCons, binanceCons } from '../utils/cote'
import main from './main'
import decrypt from './decrypt'

const { ACCOUNT: account } = process.env

const subscriber = subscriberCons({
  name: `Exchange Account ${account}`,
  subscribesTo: [ 'newSignal' ]
})

const requester = requesterCons({
  name: `Exchange Account ${account} DB Requester`,
  key: 'db',
  requests: [ 'dbGet', 'dbUpdate', 'dbInsert', 'dbFilterBy' ]
})

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}

const getKeysPair = o(props([ 'key', 'secret' ]) as any, prop('binance') as any)

requester.send({ type: 'dbGet', table: 'accounts', id: account }).then(accountRes => {
  try {
    const [ apiKey, apiSecret ] = o(map(decrypt), getKeysPair, accountRes)
    const binance = binanceCons({ apiKey, apiSecret })
    const checkAccountInfoStream = periodic(60000 * 60)

    main(exitProcess, account, binance, subscriber, requester, checkAccountInfoStream)
  } catch (err) {
    throw Error(`Account ${account} not found in database or keys are not isset.`)
  }
})
