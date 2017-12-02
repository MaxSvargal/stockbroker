import { Chain, pipe, applyTo, compose, always, nth, tail, head, prop, curry, map, chain, converge, identity } from 'ramda'
import { Observable } from 'rxjs'
import { timeInterval, switchMap, zip, flatMap, combineLatest } from 'rxjs/operators'
import { addRSIResult } from 'shared/actions'
import { CandleData } from 'shared/types'

// TODO Move utils to shared
import { createEpicWithState } from 'wally/epics/utils'
import { FromStore } from 'wally/epics/positions'

type MonadNumberArray = () => number[]

const { concat, of } = Observable

const selectCandles = (pair: string) => prop(`${pair}__candles`)

const compResultActions = curry((candles: any, pair: any) =>
  addRSIResult([ pair, Date.now(), 0 ])
)

const selectCandlesByPair = (pair: string) => prop(`${pair}__candles`)
const selectCandlesByPairApply = applyTo(selectCandlesByPair)

const rootEpic = (pairs: string[]) => createEpicWithState((fromStore: FromStore) =>
  compose(
    flatMap(() =>
      map(
        chain(compResultActions, <MonadNumberArray>pipe(selectCandles, fromStore))
      )(pairs)
    ),
    switchMap(always(Observable.interval(1000)))
  )
)

export default rootEpic
