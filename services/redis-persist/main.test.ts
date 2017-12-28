import { fromEvent } from 'most'
import { run } from 'most-test'
import { Subscriber } from 'cote'
import main from './main'

const makeSubscriber = () => ({
  on: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

const makeRedisClient = () => ({
  hset: jest.fn(),
  hmset: jest.fn()
})

describe('Redis Persist', () => {
  test('setCandles action should be work correctly', (done) => {
    const exitProcess = jest.fn()
    const subscriber = makeSubscriber()
    const redis = makeRedisClient()
    const stream = fromEvent('setCandles', subscriber)

    main(exitProcess, redis, subscriber)

    const listenersCalls = subscriber.addListener.mock.calls
    expect(listenersCalls.length).toBe(2)

    const storeSet = listenersCalls[0][1]
    const storeUpdate = listenersCalls[1][1]

    storeSet([ 'candles:trade:15m:tBTCUSD', [ [ 0, 1 ], [ 2, 3 ] ] ])
    storeUpdate([ 'candles:trade:1m:tBTCUSD', [ 9, 10 ] ])

    setTimeout(() => {
      expect(redis.hset.mock.calls.length).toBe(1)
      expect(redis.hmset.mock.calls.length).toBe(1)
      expect(redis.hset.mock.calls[0]).toEqual([ 'candles:trade:1m:tBTCUSD', '9', '[9,10]' ])
      expect(redis.hmset.mock.calls[0]).toEqual([ 'candles:trade:15m:tBTCUSD', [ '0', '[0,1]', '2', '[2,3]' ] ])
      done()
    })
  })
})
