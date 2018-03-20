import React, { Component } from 'react'
import { Div, Small, Strong } from 'glamorous'
import { apply, filter, propEq, prop, map, compose, sum, o, length, reject, isNil, path, converge, multiply, divide } from 'ramda'

const filterOpened = filter(propEq('closed', false))
const filterClosed = filter(propEq('closed', true))
const getBalance = compose(sum, reject(isNil), map(prop('profitAmount')))
const sumOfAmounts = o(sum, map(converge(multiply, [ path([ 'open', 'price' ]), path([ 'open', 'origQty' ]) ])))
const profitPerc = o(multiply(100), apply(divide))
const responsiveFontSize = null

export default class extends Component {
  render() {
    const { positions, chunksNumber } = this.props
    const balance = getBalance(positions)
    const amount = o(sumOfAmounts, filterClosed, positions)
    const profit = profitPerc([ balance, amount ])
    const openedLen = o(length, filterOpened, positions)

    return (
      <Div height='100%' display='flex' flexFlow='column wrap' alignItems='center' justifyContent='center' padding='1rem' lineHeight='3.2rem'>
        <Div color='#ec407a' display='flex' flexFlow='row nowrap' alignItems='center' >
          <Small fontSize='.9rem' marginRight='.5rem'>+ balance</Small>
          <Strong fontSize='calc(0.025 * 100vw + 1rem)'> { balance.toFixed(8) } BTC</Strong>
        </Div>
        <Div fontSize='calc(14px + (26 - 14) * ((100vw - 300px) / (1600 - 300)))' color='#5c6bc0'>
          { profit.toFixed(4) }% of volume { amount.toFixed(8) } BTC
        </Div>
        <Div>
          Opened positions: <strong>{ openedLen } / { chunksNumber }</strong>
        </Div>
      </Div>
    )
  }
}