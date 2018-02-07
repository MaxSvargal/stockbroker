import {
  curryN, subtract, apply, divide, curry, chain, pair, props, prop, compose,
  constructN, pick, evolve, converge, objOf, always, o, merge, mergeAll, lt,
  unapply, multiply, head, last, tail, filter, pathSatisfies, gte, ifElse
} from 'ramda'

type Price = number
type Perc = number
export type Order = { orderId: number, origQty: string, side: string, symbol: string }
export type Trade = { id: number, orderId: number, time: number, price: string, qty: string, commission: string, commissionAsset: string }
type PositionSide = { id: number, orderId: number, qty: number, origQty: number, time: Date, price: number, commission: number, commissionAsset: string }
export type Position = { id: number, account: string, symbol: string, closed: boolean, profitAmount?: number, profitPerc?: number, open: PositionSide, close?: PositionSide }

const fee = 0.001
const convMergeAll = converge(unapply(mergeAll))
const date = constructN(1, Date)
const pickFromOrderTrade = pick([ 'id', 'time', 'price', 'qty', 'commission', 'commissionAsset', 'orderId', 'origQty' ])
const evolvePositionProps = evolve(<any>{ price: parseFloat, time: date, qty: parseFloat, origQty: parseFloat, commission: parseFloat })
const pickPropsAndEvolve = o(evolvePositionProps, <any>pickFromOrderTrade)
const makeObjFromProps = (name: string) => converge(objOf, [ always(name), pickPropsAndEvolve ])


/* makeOpenedPosition */

const openPositionObjPredicates = [
  pick([ 'account', 'symbol' ]),
  makeObjFromProps('open'),
  always({ closed: false })
]

type MakeOpenedPosition = (xs: [ Order, Trade, { account: string } ]) => Position
const makeOpenedPosition = <MakeOpenedPosition>o(convMergeAll(<any>openPositionObjPredicates), mergeAll)


/* makeClosedPosition */

const closePositionObjPredicated = [
  makeObjFromProps('close'),
  always({ closed: true })
]

type Divside = (a: [ number, number ]) => number
const divside: Divside = converge(subtract, [ apply(multiply), o(multiply(fee), apply(multiply)) ])

type CalcProfit = (a: [ [ number, number ], [ number, number ] ]) => number
const calcProfitAmount: CalcProfit = converge(subtract, [ o(divside, last), o(divside, head) ])
const calcProfitPerc: CalcProfit = converge(divide, [ o(head, last), o(head, head) ])

type AmountPropsPair = (a: { price: number, origQty: number }) => [ number, number ]
const amountPropsPair = <AmountPropsPair>props([ 'price', 'origQty' ])
const getCloseAmountPair = compose(amountPropsPair, <any>prop('close'), head)
const getOpenAmountPair = compose(amountPropsPair, <any>prop('open'), head, head, tail)
const getAmountPairs = converge(pair, [ getOpenAmountPair, getCloseAmountPair ])

const makeProfitAmountObj = compose(objOf('profitAmount'), calcProfitAmount)
const makeProfitPercObj = compose(objOf('profitPerc'), calcProfitPerc)
const makeProfitsObj = o(<any>converge(merge, [ makeProfitAmountObj, makeProfitPercObj ]), getAmountPairs)
const getIdOfPosition = compose(pick([ 'id' ]), head, last)

const makeCompleteObj = curryN(2, unapply(convMergeAll([ getIdOfPosition, makeProfitsObj, head ])))
const makeCloseObj = o(convMergeAll(<any>closePositionObjPredicated), o(mergeAll, tail))

type MakeClosedPosition = (xs: [ Position, Order, Trade ]) => Position
const makeClosedPosition = <MakeClosedPosition>chain(makeCompleteObj, makeCloseObj)


/* findOrderToCover */

const minCoverPrice = converge(subtract, [ head, apply(multiply) ])
const openPriceLowerThan = converge(pathSatisfies, [ o(<any>gte, head), always([ 'open', 'price' ]) ])
const findOrderByMinPrice = unapply(converge(filter, [ openPriceLowerThan, last ]))

type FindOrderToCover = (a: [ Price, Perc ], b: { open: { price: number } }[]) => Position
const findOrderToCover: FindOrderToCover = unapply(o(head, converge(findOrderByMinPrice, [ o(minCoverPrice, head), last ])))


/* chunkAmountToSellCond */

const fundsNotAccomodatesTwoChunks = unapply(converge(lt, [ head, o(multiply(2), last) ]))
const chunkAmountToSellCond = ifElse(fundsNotAccomodatesTwoChunks, head, last)


export { makeOpenedPosition, makeClosedPosition, findOrderToCover, chunkAmountToSellCond }
