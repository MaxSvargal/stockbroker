import debug from 'debug'
import createStore from 'shared/store'
import rootEpic from './epics'

const { PAIR = 'BTCUSD' } = process.env
debug('worker')(`Hello, i'm a Exchanger!`)

export default createStore({
  rootEpic: rootEpic(`t${PAIR}`),
  db: {
    prefix: PAIR,
    avalialbleToSet: [ 'book', 'candles', 'tickers' ]
  }
})
