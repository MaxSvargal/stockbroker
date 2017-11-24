import { RedisClient } from 'redis'
import { Store, Reducer, Action } from 'redux'
import debug from 'debug'

const redis = require('redis')

export default class ReduxRedisPersist {
  public publisher: RedisClient
  public subscriber: RedisClient
  private publishTo: string[] = []
  private subscribeTo: string[] = []
  private store: Store<{}>
  private prefix?: string = ''
  private dbIndex?: number = 0
  private channelRegExp = new RegExp(`__keyspace@${this.dbIndex}__:(.+)__(.+)`)
  private SET_REDUCER = '@@redux-redis-persist/SET_REDUCER'

  constructor(options: { prefix?: string, publishTo: string[], subscribeTo: string[] }) {
    this.publisher = redis.createClient({ db: this.dbIndex })
    this.subscriber = redis.createClient({ db: this.dbIndex })
    this.prefix = options.prefix
    this.publishTo = options.publishTo
    this.subscribeTo= options.subscribeTo
    this.subscriber.on('message', this.onUpdateReceive.bind(this))

    return this
  }

  private onUpdateReceive(channel: string, type: string) {
    const [ , prefix = null, name = null ] = this.channelRegExp.exec(channel) || []
    const reducerName = this.getSelector(name, prefix)

    if (this.subscribeTo.includes(reducerName)) {
      this.getReducer(reducerName)
        .then(state => this.setReducer(name, state))
        .catch(err => console.error(err))
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
      this.publisher.get(selector, (err, doc) =>
        err ? reject(err) : resolve(JSON.parse(doc))))
  }

  private saveReducer(selector: string, state: any) {
    this.publisher.set(selector, JSON.stringify(state))
  }

  private getSelector(name: string, prefix = this.prefix) {
    return prefix ? `${prefix}__${name}` : name
  }

  public setStore(store: Store<{}>) {
    this.store = store
  }

  public persistentReducer = (reducer: Reducer<any>, options: { name: string }) => {
    const { subscribeTo, publishTo, SET_REDUCER } = this
    const selector = this.getSelector(options.name)

    this.getReducer(selector)
      .then(state => this.setReducer(options.name, state))
      .catch(err => console.error(err))

    if (subscribeTo && subscribeTo.includes(options.name))
      this.subscriber.subscribe(`__keyspace@${this.dbIndex}__:${selector}`)

    return (state: {}, action: { type: string, reducer?: string, state?: {} }) => {
      switch (action.type) {
        case SET_REDUCER:
          return action.reducer === options.name && action.state ?
            reducer(action.state, action) : state
        default:
          const nextState = reducer(state, action)
          if (state === nextState)
            return state
          else {
            if (state && publishTo && publishTo.includes(options.name))
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
