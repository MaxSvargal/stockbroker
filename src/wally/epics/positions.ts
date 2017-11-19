import {
  __, compose, chain, concat, curry, filter, allPass, propEq, path, propIs, propOr,
  propSatisfies, contains, reduce, map, prop, has, not, isNil, defaultTo, lte,
  head, reverse, keys, sort, nth, multiply, lt, length, divide, unless, always,
  add, sum, subtract, gte, and, cond, find, converge, identity, is, ifElse, both
} from 'ramda'

type FromStore = (selector: Function, payload?: any) => any
export interface OrderRequest { type: 'buy' | 'sell', symbol: string, from: string }
export interface OrderResponse extends OrderRequest {
  meta: { status: boolean, amount?: number, price?: number, reason?: string, covered?: number[] }
}

const selectFundsAvaliable = (curr: string) =>
  <() => number>path([ 'wallet', 'exchange', curr, 'balance' ])

const round = (num: number) => Math.round(num * 1e4) / 1e4
const selectMaxActivePositions = () => prop('maxChunksNumber')
const selectMinChunkAmount = () => prop('minChunkAmount')
const selectMinThreshold = () => prop('minThreshold')
const selectHighestBid = () => compose(chain(prop, compose(head, sort(<any>reverse), keys)), <any>prop('bids'))
const selectHighestBidPrice = () => compose(nth(0), selectHighestBid())
const selectActivePositions = (symbol: string) =>
  compose(
    chain(
      curry((ids: number[]) =>
        filter(allPass([
          propEq('symbol', symbol),
          propSatisfies(not, 'covered'),
          propSatisfies(compose(not, contains(__, ids)), 'id')
        ])
      )),
      compose(
        reduce(concat, []),
        map(<any>prop('covered')),
        filter(has('covered')))
    ),
    prop<any>('positions')
  )

export const checkOrderAvaliable = curry((fromStore: FromStore, request: OrderRequest): OrderResponse => {
  const bidPrice: number = fromStore(selectHighestBidPrice)
  const activePositions = fromStore(selectActivePositions, prop('symbol', request))
  const fundsAvaliableToSell: number = fromStore(selectFundsAvaliable, 'BTC')


  const compileResponseForBuy = (): OrderResponse['meta'] => {
    const maxActivePositions = fromStore(selectMaxActivePositions)
    const minChunksAmount = fromStore(selectMinChunkAmount)
    const fundsAvaliableToBuy: number = fromStore(selectFundsAvaliable, 'USD')

    const fundsAvaliableToBuyInFunds = divide(fundsAvaliableToBuy, bidPrice)
    const fundsAvaliable = add(fundsAvaliableToSell, fundsAvaliableToBuyInFunds)
    const amountInPositions = compose(<() => number>sum, map(<any>prop('amount')))(activePositions)
    const fundsAvaliableWithoutUsed = subtract(fundsAvaliable, amountInPositions)
    const chunkAmount = compose(round, divide(fundsAvaliableWithoutUsed), subtract(maxActivePositions), length)(activePositions)

    const isPositionAvaliable = lt(length(activePositions), maxActivePositions)
    const isFundsAvaliable = and(lte(chunkAmount, fundsAvaliableToBuyInFunds), gte(chunkAmount, minChunksAmount))
    const allConditionsPass = allPass([
      propEq('isPositionAvaliable', true),
      propEq('isFundsAvaliable', true)
    ])
    const condErrors = cond([
      [ propEq('isPositionAvaliable', false), always('Limit of open positions is reached.') ],
      [ propEq('isFundsAvaliable', false), always('No funds avaliable') ]
    ])

    return ifElse(
      allConditionsPass,
      always({ status: true, price: bidPrice, amount: chunkAmount }),
      curry((conditions: {}) => ({ status: false, reason: condErrors(conditions) }))
    )({ isPositionAvaliable, isFundsAvaliable })
  }


  const compileResponseForSell = (): OrderResponse['meta'] => {
    const minThreshold = fromStore(selectMinThreshold)

    const getValWithPercent = (perc: number) => converge(add, [ multiply(perc), identity ])
    const findPositionToCover = (current: number, threshold: number, positions: any) =>
      find(compose(gte(current), compose(getValWithPercent(threshold), <any>prop('price'))))(positions)

    const toCover: any = findPositionToCover(bidPrice, minThreshold, activePositions)
    const isFundsAvaliable: boolean = gte(fundsAvaliableToSell, prop('amount')(toCover))
    const allConditionsPass = allPass([
      propEq('isFundsAvaliable', true),
      propIs(Object, 'toCover')
    ])
    const condErrors = cond([
      [ propEq('toCover', undefined), always('No position to cover') ],
      [ propEq('isFundsAvaliable', false), always('No funds avaliable') ]
    ])

    return ifElse(
      allConditionsPass,
      always({
        status: true,
        price: bidPrice,
        amount: prop('amount', toCover),
        covered: [ prop('id', toCover) ]
      }),
      curry((conditions: {}) => ({ status: false, reason: condErrors(conditions) }))
    )({ isFundsAvaliable, toCover })
  }

  return {
    type: prop('type', request),
    symbol: prop('symbol', request),
    from: prop('from', request),
    meta: cond([
      [ propEq('type', 'buy'), compileResponseForBuy ],
      [ propEq('type', 'sell'), compileResponseForSell ]
    ])(request)
  }
})
