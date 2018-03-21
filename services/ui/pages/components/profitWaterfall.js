import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import {
  invoker, reduce, min, max, nth, head, juxt, groupBy, mapAccum, last, o, map, compose, always,
  zip, converge, constructN, unnest, keys, values, pair, tail, path, prop, sortBy, filter
} from 'ramda'

export default class extends Component {
  getCandlesOfProfit() {
    const getUTCHours = invoker(0, 'getUTCHours')
    const getUTCDate = invoker(0, 'getUTCDate')
    const minimum = o(reduce(min, Infinity), map(nth(1)))
    const maximum = o(reduce(max, -Infinity), map(nth(1)))
    const open = a => always(a) // const open = o(last, head)
    const close = o(last, last)

    return compose(
      map(unnest),
      converge(zip, [
        keys,
        compose(tail, last, mapAccum((a, b) => [
          juxt([ minimum, open(a[2] || o(last, head)(b)), close, maximum ])(b), a
        ], []), values)
      ]),
      groupBy(o(converge(pair, [ getUTCDate, getUTCHours ]), head))
    )
  }

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

  render () {
    const data = o(this.getCandlesOfProfit(), this.composeProfitRows(), this.props.positions)
    return <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Chart
        chartTitle='Waterfall'
        chartType='CandlestickChart'
        width='100%'
        data={[
          ['DATE', "val1", "val2", "val3", "val4"],
          ...data
        ]}
        options={{
          enableInteractivity: false,
          legend: 'none',
          bar: { groupWidth: '100%' },
          candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#f06292' },
            risingColor: { strokeWidth: 0, fill: '#4db6ac' },
          },
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
            titleTextStyle: {
              color: '#b0bec5'
            },
            gridlines: {
              color: '#cfd8dc'
            },
            textStyle: {
              color: '#b0bec5'
            }
          }
        }}
      />
    </div>
  }
}
