import React, { Component } from 'react'
import { filter, propEq, prop, map, compose, sum, o, length } from 'ramda'

const filterClosed = filter(propEq('closed', true))
const filterOpened = filter(propEq('closed', false))
const getBalance = compose(sum, map(prop('profitAmount')), filterClosed)

export default class extends Component {
  render() {
    const { positions, chunksNumber } = this.props
    const balance = getBalance(positions)
    const openedLen = o(length, filterOpened, positions)
    const styles = this.getStyles()

    return (
      <div style={ styles.root }>
        <div style={ styles.row }>Profit balance: <strong>{ balance.toFixed(8) } BTC</strong></div>
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