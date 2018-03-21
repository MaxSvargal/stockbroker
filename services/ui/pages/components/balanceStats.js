import React, { Component } from 'react'
import { Div, Small, Strong } from 'glamorous'
import { apply, filter, propEq, prop, map, compose, sum, o, length, reject, isNil, path, converge, multiply, divide } from 'ramda'

const filterClosed = filter(propEq('closed', true))
const getBalance = compose(sum, reject(isNil), map(prop('profitAmount')))
const sumOfAmounts = o(sum, map(converge(multiply, [ path([ 'open', 'price' ]), path([ 'open', 'origQty' ]) ])))
const profitPerc = o(multiply(100), apply(divide))
const getChunkAmount = converge(divide, [ sumOfAmounts, length ])

export default class extends Component {
  render () {
    const { positions, chunksNumber, openedNowLen } = this.props
    const balance = getBalance(positions)
    const amount = o(sumOfAmounts, filterClosed, positions)
    const chunkAmount = getChunkAmount(positions)
    const tradeAmount = multiply(chunkAmount, chunksNumber)
    const profit = profitPerc([ balance, amount ])

    return (
      <Div height='100%' display='flex' flexFlow='column wrap' alignItems='center' justifyContent='center' paddingTop='1rem'>
        <Div color='#ec407a' display='flex' flexFlow='row nowrap' alignItems='center' lineHeight='4rem'>
          <Small fontSize='.9rem' marginRight='.5rem'>+ balance</Small>
          <Strong fontSize='calc(0.025 * 100vw + 1rem)'> { balance.toFixed(8) } BTC</Strong>
        </Div>
        <Div fontSize='calc(14px + (26 - 14) * ((100vw - 300px) / (1600 - 300)))' color='#5c6bc0' marginBottom='2rem'>
          { profit.toFixed(4) }% of volume { amount.toFixed(8) } BTC
        </Div>
        <Div display='flex' flexFlow='row wrap' justifyContent='center' lineHeight='1.8rem'>
          <Div textAlign='right' paddingRight='1rem'>
            <div>Capital:</div>
            <div>Chunk amount:</div>
            <div>Opened positions:</div>
          </Div>
          <Div>
            <div>~<strong>{ tradeAmount.toFixed(8) }</strong> BTC</div>
            <div>~<strong>{ chunkAmount.toFixed(8) }</strong> BTC</div>
            <div><strong>{ openedNowLen } / { chunksNumber }</strong></div>
          </Div>
        </Div>
      </Div>
    )
  }
}