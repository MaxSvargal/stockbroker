import debug from 'debug'
import createStore from 'shared/store'
import rootSaga from './sagas'
import rootEpic from './epics'

const { ACCOUNT = 'demo' } = process.env
debug('worker')(`Hello, ${ACCOUNT}! I'm a Wally!`)

export default createStore({
  rootSaga,
  rootEpic,
  db: {
    prefix: ACCOUNT,
    avalialbleToSet: [ 'wallet', 'positions' ]
  },
  account: ACCOUNT
})
