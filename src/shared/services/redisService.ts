import { RedisClient } from 'redis'
import { Store, Reducer, Action } from 'redux'
import debug from 'debug'

const redis = require('redis')

export default class ReduxRedisPersist {
  public publisher: RedisClient
  public subscriber: RedisClient
  private avalialbleToSet?: string[] = []
  private avalialbleToSubscribe?: string[] = []
  private store: Store<{}>
  private prefix?: string = ''
  private dbIndex?: number = 0
  private channelRegExp = new RegExp(`__keyspace@${this.dbIndex}__:(.+)__(.+)`)
  private SET_REDUCER = '@@redux-redix-persist/SET_REDUCER'

  constructor(options: { prefix?: string, avalialbleToSet?: string[], avalialbleToSubscribe?: string[] }) {
    this.publisher = redis.createClient({ db: this.dbIndex })
    this.subscriber = redis.createClient({ db: this.dbIndex })
    this.prefix = options.prefix
    this.avalialbleToSet = options.avalialbleToSet
    this.avalialbleToSubscribe = options.avalialbleToSubscribe
    this.subscriber.on('message', this.onUpdateReceive. bind(this))

    return this
  }

  private onUpdateReceive(channel: string, type: string) {
    const [ , prefix = null, reducer = null ] = this.channelRegExp.exec(channel) || []
    if (prefix === this.prefix && reducer) {
      this.getReducer(`${prefix}__${reducer}`)
        .then(state => this.setReducer(reducer, state))
    }
  }

  private setReducer(name: string, state: any) {
    this.store.dispatch({
      type: this.SET_REDUCER,
      reducer: name,
      state
    })
  }

  private getReducer(selector: string) {
    return new Promise((resolve, reject) =>
      (this.publisher || this.subscriber).get(selector, (err, doc) =>
        err ? reject(err) : resolve(JSON.parse(doc))))
  }

  private saveReducer(selector: string, state: any) {
    this.publisher.set(selector, JSON.stringify(state))
  }

  public setStore(store: Store<{}>) {
    this.store = store
  }

  public persistentReducer = (reducer: Reducer<any>, options: { name: string }) => {
    const { avalialbleToSubscribe, avalialbleToSet, SET_REDUCER } = this
    const selector = `${this.prefix}__${options.name}`

    this.getReducer(selector)
      .then(state => this.setReducer(options.name, state))

    if (avalialbleToSubscribe && avalialbleToSubscribe.includes(options.name))
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
            if (state && avalialbleToSet && avalialbleToSet.includes(options.name))
              process.nextTick(() => this.saveReducer(selector, nextState))
            return nextState
          }
      }
    }
  }

  public publish(channel: string, message: string | {}) {
    this.publisher.publish(`${this.prefix}_${channel}`,
      typeof message === 'object' ? JSON.stringify(message) : message)
  }

  public subscribe(channel: string, cb: (msg: string) => void) {
    this.subscriber.subscribe(`${this.prefix}_${channel}`)
    this.subscriber.on('message', (chan: string, msg: string) =>
      `${this.prefix}_${channel}` === chan && cb(msg))
  }

  public unsubscribe(channel: string) {
    this.subscriber.unsubscribe(channel)
  }
}
