import debug from 'debug'
import createStore from 'shared/store'
import rootEpic from './epics'

const { ACCOUNT = 'demo' } = process.env
debug('worker')(`Hello, ${ACCOUNT}! I'm a Wally!`)

export default createStore({
  rootEpic,
  db: {
    prefix: ACCOUNT,
    avalialbleToSubscribe: [ 'asks', 'bids', 'tickers' ],
    avalialbleToSet: [ 'wallet', 'positions' ]
  },
  account: ACCOUNT
})
