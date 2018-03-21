import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import { mapAccum, last, o, map, compose, zip, converge, constructN, path, prop, sortBy, filter } from 'ramda'

export default class extends Component {
  composeProfitRows() {
    const date = constructN(1, Date)
    const accumSeq = mapAccum((a, b) => [a + b, a + b], 0)
    
    return compose(
      converge(zip, [
        map(o(date, path([ 'close', 'time' ]))),
        compose(last, accumSeq, map(prop('profitAmount')))
      ]),
      sortBy(path([ 'close', 'time' ])),
      filter(prop('close'))
    )
  }

  render() {
    const data = this.composeProfitRows()(this.props.positions)

    return <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Chart
        chartType='LineChart'
        columns={ [
          { label: 'time', type: 'datetime' },
          { label: 'balance', type: 'number' }
        ] }
        rows={ data }
        legend={ true }
        options={ {
          enableInteractivity: false,
          legend: 'none',
          hAxis: { title: 'Time' },
          vAxis: { title: 'Balance', format: 'decimal' },
          curveType: 'function',
          colors: [ '#03a9f4' ],
          hAxis: {
            title: 'Day, Hour',
            titleTextStyle: {
              color: '#b0bec5'
            },
            textStyle: {
              color: '#b0bec5'
            }
          },
          vAxis: {
            title: 'Absolute Profit',
            gridlines: {
              color: '#cfd8dc'
            },
            textStyle: {
              color: '#b0bec5'
            }
          }
        } }
        width="100%"
      />
    </div>
  }
}
