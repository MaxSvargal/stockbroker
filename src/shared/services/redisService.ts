import { RedisClient } from 'redis'
import { Store, Reducer, Action } from 'redux'
import debug from 'debug'

const redis = require('redis')

export default class ReduxRedisPersist {
  publisher: RedisClient
  subscriber: RedisClient
  avalialbleToSet: string[]
  avalialbleToSubscribe: string[]
  store: Store<{}>
  prefix: string
  SET_REDUCER = '@@redux-redix-persist/SET_REDUCER'

  constructor(options: { prefix: string, avalialbleToSet: string[], avalialbleToSubscribe: string[] }) {
    this.publisher = redis.createClient({ db: 1 })
    this.subscriber = redis.createClient({ db: 1 })
    this.prefix = options.prefix
    this.avalialbleToSet = options.avalialbleToSet
    this.avalialbleToSubscribe = options.avalialbleToSubscribe
    this.persistentReducer = this.persistentReducer.bind(this)
    this.subscriber.on('message', this.onUpdateReceive. bind(this))

    return this
  }

  onUpdateReceive(channel: string, type: string) {
    const [ , prefix = null, reducer = null ] = channel.match(/__keyspace@1__:(.+)__(.+)/) || []
    if (prefix === this.prefix && reducer) {
      this.getReducer(`${prefix}__${reducer}`)
        .then(state => this.setReducer(reducer, state))
    }
  }

  setStore(store: Store<{}>) {
    this.store = store
  }

  setReducer(name: string, state: any) {
    this.store.dispatch({
      type: this.SET_REDUCER,
      reducer: name,
      state
    })
  }

  getReducer(selector: string) {
    return new Promise((resolve, reject) =>
      (this.publisher || this.subscriber).get(selector, (err, doc) =>
        err ? reject(err) : resolve(JSON.parse(doc))))
  }

  saveReducer(selector: string, state: any) {
    this.publisher.set(selector, JSON.stringify(state))
  }

  persistentReducer(reducer: Reducer<any>, options: { name: string }) {
    const { avalialbleToSubscribe, avalialbleToSet, SET_REDUCER } = this
    const selector = `${this.prefix}__${options.name}`

    this.getReducer(selector)
      .then(state => this.setReducer(options.name, state))

    if (avalialbleToSubscribe.includes(options.name))
      this.subscriber.subscribe(`__keyspace@1__:${selector}`)

    return (state: {}, action: { type: string, reducer?: string, state?: {} }) => {
      switch (action.type) {
        case SET_REDUCER:
          if (action.reducer === options.name && action.state) {
            return reducer(action.state, action)
          }
        default:
          const nextState = reducer(state, action)
          if (state === nextState)
            return state
          else {
            if (avalialbleToSet.includes(options.name))
              process.nextTick(() => this.saveReducer(selector, nextState))
            return nextState
          }
      }
    }
  }
}
