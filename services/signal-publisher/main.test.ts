import { just } from 'most'
import { run } from 'most-test'
import main from './main'

const makeRequester = ({ candles }: any) => ({
  send: jest.fn().mockReturnValue(candles)
})

const makePublisher = () => ({
  publish: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

describe('Signal Publisher', () => {
  test('should be done', async () => {
    const candles = [
      '[1514990110000, 22.20, 20.80, 22.5, 20.8, 10]',
      '[1514990120000, 20.30, 19.80, 20.30, 19.8, 10]',
      '[1514990130000, 20.70, 21.58, 20.7, 21.58, 10]',
    ]
    const symbol = 'BTCUSD'
    const exitProcess = (err: Error) => { throw err }
    const requester = makeRequester({ candles })
    const publisher = makePublisher()
    const loopStream = just(null)

    main(exitProcess, loopStream, requester, publisher, symbol)

    await run(loopStream).tick(1)

    // expect(requester.send.mock.calls.length).toBe(2)
    expect(publisher.publish).toBeCalledWith('newIndicatorsResults', {
      time: 1514990130000,
      bearish: false,
      bullish: true,
      close: 21.58
    })

  })
})
