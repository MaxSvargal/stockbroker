import React, { Component } from 'react'
import { filter, propEq, merge, o, prop, values, fromPairs, map, props, compose, length, reverse } from 'ramda'

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
    const { positions, chunksNumber } = this.props
    const styles = this.getStyles()
    const opened = o(reverse, filterOpened, positions)

    return (
      <div style={ styles.root }>
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
      list: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-around'
      }
    }
  }
}