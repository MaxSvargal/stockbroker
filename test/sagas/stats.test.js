import test from 'ava'
import { testSaga } from 'redux-saga-test-plan'
import { addStats } from 'shared/actions'
import { generateStatsSaga } from 'worker/sagas/stats'
import {
  selectSellsDuringTime, selectBuysDuringTime, selectCurrencyProps,
  selectCurrentTime, selectLastStat
} from 'worker/sagas/selectors'

test('generateStatsSaga should work correctly', () => {
  const trade = [
    [ 0, 0.011, 1 ], [ 1, 0.012, 2 ], [ 2, 0.013, 1 ], [ 3, 0.014, 5 ],
    [ 4, 0.013, 1 ], [ 5, 0.012, 1 ], [ 6, 0.013, 2 ], [ 7, 0.014, 3 ]
  ]
  const lastStat = { created: 0, lowestAsk: 0.01, highestBid: 0.012, buyChange: 0, sellChange: 0 }
  const currecyProps = { last: 0.011, lowestAsk: 0.011, highestBid: 0.014 }
  const expected = { created: 1, last: 0.011, lowestAsk: 0.011, highestBid: 0.014, buyChange: 2.86935287, sellChange: 2.86935287 }

  return testSaga(generateStatsSaga)
    .next()
    .select(selectLastStat)
    .next(lastStat)
    .select(selectBuysDuringTime, 0)
    .next(trade)
    .select(selectSellsDuringTime, 0)
    .next(trade)
    .select(selectCurrencyProps)
    .next(currecyProps)
    .select(selectCurrentTime)
    .next(1)
    .put(addStats(expected))
})

// const stagnationGrapth = []
// const gradualIncreaseGrapth = []
// const gradualFallGrapth = []
// // const suddenJumpGrapth = []
// // const abruptFallGrapth = []

// реагировать только на значениях 0.00хх
// игнорировать при 0.000х
// как только значение уходит в минус - это пик, учитывать любые значения
// далее игнорировать значения -0.000х
// постоянное увеличение отрицательной динамики - вводить троттлинг (?) для продажи и покупки
// при достижении положительного значения два раза подряд (!) - закупаться (дно детектед)
// реагирование только на 0.001х

// отсекать вот такие вот 0.00051313 0.00041788
// 0.00003105 0.00000713 / 0.00003139 0.00000703 / стагнация


// test('generateStatsSaga should handle reducer what store stat correctly', () =>
//   expectSaga(generateStatsSaga)
//     .withState({
//       stats: [
//         { created: 1493393197675, last: 0.011, lowestAsk: 0.011, highestBid: 0.014, buyChange: 2.86935287, sellChange: 2.86935287 }
//       ],
//       buy: [
//         [ 1493395259900, 0.011, 1 ],
//         [ 1493395261070, 0.012, 2 ],
//         [ 1493395262120, 0.013, 1 ],
//         [ 1493395262120, 0.014, 1 ]
//       ],
//       sell: [
//         [ 1493395259900, 0.011, 1 ],
//         [ 1493395261070, 0.012, 2 ],
//         [ 1493395262120, 0.013, 1 ],
//         [ 1493395262120, 0.014, 1 ]
//       ],
//       currentPair: 'BTC_ETH',
//       currencies: {
//         BTC_ETH: { last: 0.013, lowestAsk: 0.013, highestBid: 0.011 }
//       }
//     })
//     .put(addStats({ created: new Date().getTime() + 11, last: 0.011, lowestAsk: 0.011, highestBid: 0.014, buyChange: 2.86935287, sellChange: 2.86935287 }))
//     .run())
