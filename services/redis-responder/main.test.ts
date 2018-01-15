import { fromEvent } from 'most'
import { run } from 'most-test'
import { Subscriber } from 'cote'
import main from './main'

const makeResponder = () => ({
  on: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

const makeRedisClient = () => ({
  hvals: jest.fn()
})

describe('Redis Responder', () => {
  test('storeGetAll should work correctly', (done) => {
    const exitProcess = jest.fn()
    const responder = makeResponder()
    const redis = makeRedisClient()
    const responseCb = jest.fn(function(err, value) { return value })

    main(exitProcess, redis, responder)

    const listenersCalls = responder.addListener.mock.calls
    const storeGetAll = listenersCalls[0][1]

    expect(listenersCalls).toBeCalled
    storeGetAll([ { type: 'cacheHashGetValues', key: 'candles:15m:tBTCUSD' }, responseCb ])

    setTimeout(() => {
      expect(redis.hvals).toBeCalled()
      // TODO: check it deeper
      expect(redis.hvals.mock.calls[0][0]).toBe('candles:15m:tBTCUSD')
      expect(typeof redis.hvals.mock.calls[0][1]).toBe('function')
      done()
    })
  })
})
