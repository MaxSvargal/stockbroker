import {
  curryN, subtract, apply, divide, chain, pair, props, prop, compose, add, init,
  constructN, pick, evolve, converge, objOf, always, o, merge, mergeAll, lt, path,
  unapply, multiply, head, last, tail, gte, ifElse, map, find
} from 'ramda'

type Price = number
type Perc = number
type MinProfit = number
export type Order = { orderId: number, origQty: string, side: string, symbol: string }
export type Trade = { id: number, orderId: number, time: number, price: string, qty: string, commission: string, commissionAsset: string }
type PositionSide = { id: number, orderId: number, qty: number, origQty: number, time: Date, price: number, commission: number, commissionAsset: string }
export type Position = { id: number, account: string, symbol: string, closed: boolean, profitAmount?: number, profitPerc?: number, open: PositionSide, close?: PositionSide }

const fee = 0.0005
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

const margin = converge(divide, [ converge(subtract, [ last, head ]), ifElse(converge(lt, [ head, last ]), head, last) ])
const marginWithFee = converge(subtract, [ margin, always(multiply(fee, 2)) ])
const calcProfitPerc = compose(multiply(100), marginWithFee, map(head))

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
const compareWithMinCover = curryN(2, unapply(converge(gte, [ o(minCoverPrice, head), o(path([ 'open', 'price' ]), last) ])))

type FindPositionToCover = (a: Price, b: MinProfit, c: { open: { price: number } }[] ) => Position
const findPositionToCover = unapply(converge(find, [ o(compareWithMinCover, init), last ]))


/* chunkAmountToSellCond */

const fundsNotAccomodatesTwoChunks = unapply(converge(lt, [ head, o(multiply(2), last) ]))
const chunkAmountToSellCond = ifElse(fundsNotAccomodatesTwoChunks, head, last)


export { makeOpenedPosition, makeClosedPosition, findPositionToCover, chunkAmountToSellCond }
