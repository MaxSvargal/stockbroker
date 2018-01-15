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
  hset: jest.fn().mockImplementation((k, f, v, cb) => cb(null, 'OK')),
  hmset: jest.fn().mockImplementation((k, vs, cb) => cb(null, 'OK'))
})

describe('Redis Persist', () => {
  test('cacheHashSet and cacheHashMultiSet actions should be work correctly', async () => {
    const exitProcess = jest.fn()
    const redis = makeRedisClient()
    const responder = makeResponder()
    const responseHashSet = jest.fn(function(err, value) { return value })
    const responseHashMultiSet = jest.fn(function(err, value) { return value })

    main(exitProcess, redis, responder)

    const listenersCalls = responder.addListener.mock.calls
    expect(listenersCalls.length).toBe(2)

    const cacheHashSet = listenersCalls[0][1]
    const cacheHashMultiSet = listenersCalls[1][1]

    cacheHashSet([
      { type: 'cacheHashSet', key: 'candles:1m:BNBUSDT', field: '1010', value: '[1010,1,2]' },
      responseHashSet
    ])
    cacheHashMultiSet([
      { type: 'cacheHashMultiSet', key: 'candles:15m:BNBUSDT', values: [ '0', '[0,1]', '1', '[1,2]' ] },
      responseHashMultiSet
    ])

    await Promise.resolve()

    expect(redis.hset).toHaveBeenCalledTimes(1)
    expect(redis.hset).toHaveBeenCalledWith('candles:1m:BNBUSDT', '1010', '[1010,1,2]', responseHashSet)
    expect(responseHashSet).toHaveBeenCalledTimes(1)
    expect(responseHashSet).toHaveBeenLastCalledWith(null, 'OK')

    expect(redis.hmset).toHaveBeenCalledTimes(1)
    expect(redis.hmset).toHaveBeenCalledWith('candles:15m:BNBUSDT', [ '0', '[0,1]', '1', '[1,2]' ], responseHashMultiSet)
    expect(responseHashMultiSet).toHaveBeenCalledTimes(1)
    expect(responseHashMultiSet).toHaveBeenLastCalledWith(null, 'OK')
  })
})
