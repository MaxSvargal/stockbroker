import {
  __, compose, chain, concat, curry, filter, allPass, propEq, path, propIs, propOr,
  propSatisfies, contains, reduce, map, prop, has, not, isNil, defaultTo, lte, slice,
  head, reverse, keys, sort, nth, multiply, lt, length, divide, unless, always, match,
  add, sum, subtract, gte, and, cond, find, converge, identity, is, ifElse, both, negate
} from 'ramda'

export interface OrderRequest {
  type: 'buy' | 'sell',
  symbol: string,
  from: string,
  options: {
    usePercentOfFund: number,
    maxChunksNumber: number,
    minChunkAmount: number,
    minThreshold: number
  }
}
interface OrderResponseResolved { status: boolean, amount?: number, price?: number, covered?: number[] }
interface OrderResponseRejected { status: boolean, reason?: string }
export type OrderResponseMeta = OrderResponseResolved | OrderResponseRejected
export interface OrderResponse extends OrderRequest { meta: OrderResponseMeta }
type FromStore = (selector: Function, payload?: any) => any

const symbolToPair = compose(slice(1, 3), match(/^t(\w{1,3})(\w{1,3})$/))
const round = (num: number) => Math.round(num * 1e4) / 1e4
const getReqOption = (name: string) => path([ 'options', name ])
const selectFundsAvaliable = (curr: string) =>
  <() => number>path([ 'wallet', 'exchange', curr, 'balance' ])
const selectHighestBid = () =>
  compose(chain(prop, compose(head, sort(<any>reverse), keys)), <any>prop('bids'))
const selectHighestBidPrice = () =>
  compose(nth(0), defaultTo([]), selectHighestBid())
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
  const symbol = prop('symbol', request)
  const pair = symbolToPair(symbol)
  const bidPrice: number = fromStore(selectHighestBidPrice)
  const activePositions = fromStore(selectActivePositions, symbol)
  const fundsAvaliableToSell: number = fromStore(selectFundsAvaliable, nth(0, pair))
  const fundsAvaliableToBuy: number = fromStore(selectFundsAvaliable, nth(1, pair))

  function compileResponseForBuy(): OrderResponseMeta {
    const maxActivePositions = <number>getReqOption('maxChunksNumber')(request)
    const minChunksAmount = <number>getReqOption('minChunkAmount')(request)

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

  function compileResponseForSell(): OrderResponseMeta {
    const minThreshold = <number>getReqOption('minThreshold')(request)

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
        amount: compose(negate, <any>prop('amount'))(toCover),
        covered: [ prop('id', toCover) ]
      }),
      curry((conditions: {}) => ({ status: false, reason: condErrors(conditions) }))
    )({ isFundsAvaliable, toCover })
  }

  return {
    type: prop('type', request),
    symbol: prop('symbol', request),
    from: prop('from', request),
    options: prop('options', request),
    meta: cond([
      [ propEq('type', 'buy'), compileResponseForBuy ],
      [ propEq('type', 'sell'), compileResponseForSell ]
    ])(request)
  }
})
