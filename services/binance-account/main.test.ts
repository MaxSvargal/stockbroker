import { fromEvent } from 'most'
import { run } from 'most-test'
import { Subscriber } from 'cote'
import main from './main'

const tick = () => Promise.resolve()

describe('Binance Account Events', () => {
  test('should bind requests correctly', () => {
    const binance = ({
      accountInfo: jest.fn().mockReturnValue(Promise.resolve()),
      order: jest.fn().mockReturnValue(Promise.resolve()),
      myTrades: jest.fn().mockReturnValue(Promise.resolve())
    })
  })
})
