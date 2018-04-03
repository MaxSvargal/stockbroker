import fetch from 'node-fetch'

import { symbols, ticker, candles } from '../services/trade-master/modules/exchangeRequests'
import analysisToEnable from '../services/trade-master/modules/analysis'

describe('Algorytm tests', () => {
  test('test', async () => {
    // const cndls = await candles(fetch)({ symbol: 'OAXETH', interval: '30m', limit: 50 })
    
    const requests = {
      fetchTicker: ticker(fetch),
      fetchCandles: candles(fetch),
      setEnabledSymbols: jest.fn().mockReturnValue(Promise.resolve()),
      startSignallerProcess: jest.fn().mockReturnValue(Promise.resolve())
    }

    // анализ свеч когда вход на покупку открывается и закрывается, анализировать с цены открытия до максимума
    // в промежутках открытия провести анализ на возможность покупок
    // после покупок
  })
})