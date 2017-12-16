import { run } from 'shared/test/utils'
import rootEpic from '../index'
import { addRSIResult } from 'shared/actions'

const rootPairEpic = rootEpic('BTCUSD')

test('Order flow should handle resolved signal request to sell and return create position to sell', () => {
  run(
    rootPairEpic,
    {
      'BTCUSD__candles': [
        [ 0, 0, 1 ],
        [ 0, 0, 2 ]
      ]
    },
    'a-----',
    '-----a',
    {
      a: addRSIResult([ '', 0, 0 ])
    },
    {
      a: addRSIResult([ 'BTCUSD', Date.now(), 0 ])
    }
  )
  //
  // const Rx = require('rxjs');
  //
  // function timeRange(start, end, interval = 1000, scheduler = Rx.Scheduler.async) {
  //   return Rx.Observable.interval(interval, scheduler)
  //     .map(n => n + start)
  //     .take(end - start + 1)
  // }
  //
  // let scheduler = new Rx.TestScheduler((actual, expected) => expect(actual).toEqual(expected))
  // let source = timeRange(2, 8, 50, scheduler);
  // let values = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8};
  // scheduler.expectObservable(source).toBe('-----2----3----4----5----6----7----(8|)', values);
  //
  // scheduler.flush();
})
