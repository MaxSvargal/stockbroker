import debug from 'debug'
import createStore from 'shared/store'
import rootSaga from './sagas'

const { ACCOUNT = 'demo' } = process.env
debug('worker')(`Welcome to stockbroker\'s Pivot, ${ACCOUNT}!`)

export default createStore({
  rootSaga,
  db: {
    prefix: ACCOUNT,
    avalialbleToSet: [ 'macd' ],
    avalialbleToSubscribe: [ 'asks', 'bids', 'wallet', 'candles', 'tickers' ]
  },
  account: ACCOUNT
})
