import React, { Component } from 'react'
import { apply, filter, propEq, prop, map, compose, sum, o, length, reject, isNil, path, converge, multiply, divide } from 'ramda'

const filterOpened = filter(propEq('closed', false))
const filterClosed = filter(propEq('closed', true))
const getBalance = compose(sum, reject(isNil), map(prop('profitAmount')))
const sumOfAmounts = o(sum, map(converge(multiply, [ path([ 'open', 'price' ]), path([ 'open', 'origQty' ]) ])))
const profitPerc = o(multiply(100), apply(divide))

export default class extends Component {
  render() {
    const { positions, chunksNumber } = this.props
    const balance = getBalance(positions)
    const amount = o(sumOfAmounts, filterClosed, positions)
    const profit = profitPerc([ balance, amount ])

    const openedLen = o(length, filterOpened, positions)
    const styles = this.getStyles()

    return (
      <div style={ styles.root }>
        <div style={ styles.row }>
          Profit balance: <strong>{ balance.toFixed(8) } BTC</strong> |
          <small> +{ profit.toFixed(4) }% of { amount.toFixed(8) } BTC</small>
        </div>
        <div style={ styles.row }>Opened positions: <strong>{ openedLen } / { chunksNumber }</strong></div>
      </div>
    )
  }

  getStyles() {
    return {
      root: {
        background: '#4A2A4A',
        color: '#FAF2FA',
        width: '100%',
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-around',
        flexGrow: 1,
        flexBasis: 0
      },
      row: {
        padding: '1rem'
      }
    }
  }
}