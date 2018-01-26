import { just } from 'most'
import { run } from 'most-test'
import main from './main'

const makeRequester = ({ candles1m, candles5m }: any) => ({
  send: jest.fn()
    .mockReturnValueOnce(candles1m)
    .mockReturnValueOnce(candles5m)
})

const makePublisher = () => ({
  publish: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

describe('Signal Publisher', () => {
  test('should be send buy signal', async () => {
    const candles1m = [
      //  time, open, high, low, close, volume
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 8, 7, 6, 0]',
      '[1514990110000, 0, 7, 6, 5, 0]',
      '[1514990110000, 0, 6, 5, 4, 0]',
      '[1514990110000, 0, 5, 4, 3, 0]',
      '[1514990110000, 0, 4, 3, 2, 0]',
      '[1514990110000, 0, 3, 2, 1, 0]',
      '[1514990110000, 0, 19, 18, 17, 0]',
    ]
    const candles5m = [
      //  time, open, high, low, close, volume
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 8, 7, 6, 0]',
      '[1514990110000, 0, 7, 6, 5, 0]',
      '[1514990110000, 0, 6, 5, 4, 0]',
      '[1514990110000, 0, 5, 4, 3, 0]',
      '[1514990110000, 0, 4, 3, 2, 0]',
      '[1514990110000, 0, 2, 2, 1, 0]',
      '[1514990110000, 0, 4, 2, 4, 0]',
    ]
    const symbol = 'BTCUSD'
    const exitProcess = (err: Error) => { throw err }
    const requester = makeRequester({ candles1m, candles5m })
    const publisher = makePublisher()
    const loopStream = just(null)

    main(exitProcess, loopStream, requester, publisher, symbol)

    await run(loopStream).tick(1)

    // expect(requester.send.mock.calls.length).toBe(2)
    expect(publisher.publish).toBeCalledWith('newSignal', {
      symbol,
      price: 17,
      type: 'BUY',
      time: expect.any(Number)
    })
  })

  test('should NOT be send any messages', async () => {
    const candles1m = [
      //  time, open, high, low, close, volume
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 8, 7, 6, 0]',
      '[1514990110000, 0, 7, 6, 5, 0]',
      '[1514990110000, 0, 6, 5, 4, 0]',
      '[1514990110000, 0, 5, 4, 3, 0]',
      '[1514990110000, 0, 4, 3, 2, 0]',
      '[1514990110000, 0, 3, 2, 1, 0]',
      '[1514990110000, 0, 19, 18, 17, 0]',
    ]
    const candles5m = [
      //  time, open, high, low, close, volume
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 9, 8, 7, 0]',
      '[1514990110000, 0, 8, 7, 6, 0]',
      '[1514990110000, 0, 7, 6, 5, 0]',
      '[1514990110000, 0, 6, 5, 4, 0]',
      '[1514990110000, 0, 5, 4, 3, 0]',
      '[1514990110000, 0, 6, 4, 6, 0]',
      '[1514990110000, 0, 7, 5, 8, 0]',
      '[1514990110000, 0, 8, 6, 7, 0]',
    ]
    const symbol = 'BTCUSD'
    const exitProcess = (err: Error) => { throw err }
    const requester = makeRequester({ candles1m, candles5m })
    const publisher = makePublisher()
    const loopStream = just(null)

    main(exitProcess, loopStream, requester, publisher, symbol)

    await run(loopStream).tick(1)

    expect(publisher.publish).toHaveBeenCalledTimes(0)
  })
})
