import React, { Component } from 'react'
import { Chart } from 'react-google-charts'

export default class extends Component {
  getRows(arr) {
    return arr.map(({ symbol, profitPerc, open, close }) => [
      symbol, `${profitPerc ? profitPerc.toFixed(2) + '% |' : ''} ${open.price} -> ${close ? close.price : '|'}`, new Date(open.time), close ? new Date(close.time) : new Date()
    ])
  }

  render() {
    const data = this.getRows(this.props.positions)

    return <Chart
      chartType='Timeline'
      graph_id='Timeline'
      columns={ [
        { id: 'symbol', type: 'string' },
        { id: 'info', type: 'string' },
        { id: 'opened', type: 'date' },
        { id: 'closed', type: 'date' }
      ] }
      rows={ data }
      width="99%"
      height="100vh"
      chartPackage={ [ 'timeline' ] }
    />
  }
}