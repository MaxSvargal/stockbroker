import main from './main'
import { just } from 'most'
import { run } from 'most-test'

const makeRequester = (enabledSymbols: string[]) => ({
  send: jest.fn().mockReturnValueOnce(Promise.resolve(enabledSymbols))
})
const makePublisher = () => ({
  publish: jest.fn().mockReturnValueOnce('OK')
})
const makeFetch = (candles: any[][]) =>
  jest.fn().mockReturnValue(Promise.resolve({ json: () => Promise.resolve(candles) }))

describe('Trade Master', () => {
  test('should work correctly', async () => {
    const exitProcess = jest.fn()
    const requester = makeRequester([ 'NEOBTC', 'MCOBTC', 'ETHBTC' ])
    const publisher = makePublisher()
    const mainLoopStream = just({})
    const env = run(mainLoopStream)
    const fetch = makeFetch([
      [ 0, '1', '2', '0.5', '1.5', '100' ],
      [ 0, '1.5', '2.5', '1.5', '2', '100' ],
      [ 0, '2', '3', '1.5', '2.5', '100' ],
      [ 0, '2.5', '3.5', '2', '3', '100' ],
      [ 0, '1', '1', '0', '0', '100' ]
    ])

    main(exitProcess, mainLoopStream, requester, publisher, fetch)
    await env.tick()

    expect(requester.send).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledTimes(6)
    expect(fetch).toHaveBeenCalledWith('https://binance.com/api/v1/klines?symbol=ETHBTC&interval=15m&limit=20')
    expect(fetch).toHaveBeenCalledWith('https://binance.com/api/v1/klines?symbol=ETHBTC&interval=15m&limit=20')
    expect(fetch).toHaveBeenCalledWith('https://binance.com/api/v1/klines?symbol=MCOBTC&interval=15m&limit=20')
    expect(fetch).toHaveBeenCalledWith('https://binance.com/api/v1/klines?symbol=MCOBTC&interval=15m&limit=20')
    expect(fetch).toHaveBeenCalledWith('https://binance.com/api/v1/klines?symbol=NEOBTC&interval=15m&limit=20')
    expect(fetch).toHaveBeenCalledWith('https://binance.com/api/v1/klines?symbol=NEOBTC&interval=15m&limit=20')

    expect(publisher.publish).toHaveBeenCalledTimes(3)
    expect(publisher.publish).toBeCalledWith('newSignal', expect.objectContaining({ symbol: 'MCOBTC' }))
    expect(publisher.publish).toBeCalledWith('newSignal', expect.objectContaining({ symbol: 'ETHBTC' }))
    expect(publisher.publish).toBeCalledWith('newSignal', expect.objectContaining({ symbol: 'NEOBTC' }))
  
    await env.tick()
    expect(requester.send).toHaveBeenCalledTimes(2)
  })
})
