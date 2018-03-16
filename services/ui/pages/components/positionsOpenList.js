import React, { Component } from 'react'
import { filter, propEq, merge, o, prop, values, fromPairs, map, props, compose, length } from 'ramda'

import Item from './positionsOpenListItem'

const filterOpened = filter(propEq('closed', false))
const makeSymbolPriceObj = compose(fromPairs, map(props([ 's', 'c' ])), values)

export default class extends Component {
  state = { ticker: {} }

  componentWillMount() {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
    ws.onmessage = (ev) =>
      this.setState({ ticker: merge(this.state.ticker, makeSymbolPriceObj(JSON.parse(ev.data))) })
  }

  render() {
    const styles = this.getStyles()
    const opened = filterOpened(this.props.positions)

    return (
      <div style={ styles.root }>
        <div style={ styles.head }>
          <h2 style={ styles.h2 }>Opened positions</h2>
          <strong style={ styles.headCounter }>{ length(opened) } / 12</strong>
        </div>
        <div style={ styles.list }>
          { opened.map(pos =>
            <Item
              key={ pos.id }
              position={ pos }
              ticker={ prop(pos.symbol, this.state.ticker) } />
          ) }
        </div>
      </div>
    )
  }

  getStyles() {
    return {
      root: {
        width: '100vw',
        overflow: 'scroll'
      },
      head: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        marginBottom: '.5rem'
      },
      h2: {
        margin: 0
      },
      headCounter: {
        fontSize: '0.9rem',
        margin: '0 1rem',
        color: '#999'
      },
      list: {
        display: 'flex',
        flexFlow: 'row wrap',
        height: '25vh'
      }
    }
  }
}