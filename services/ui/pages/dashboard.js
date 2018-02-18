import React from 'react'
import { Chart } from 'react-google-charts'
import {
  invoker, reduce, min, max, nth, head, juxt, groupBy, mapAccum, last, o, map, compose, always,
  filter, path, prop, zip, converge, constructN, sortBy, unnest, keys, values, pair, tail
} from 'ramda'

import Position from './components/position'

const date = constructN(1, Date)
const getUTCHours = invoker(0, 'getUTCHours')
const getUTCDate = invoker(0, 'getUTCDate')
const minimum = o(reduce(min, Infinity), map(nth(1)))
const maximum = o(reduce(max, -Infinity), map(nth(1)))
const open = a => always(a) // const open = o(last, head)
const close = o(last, last)
const getCandlesOfProfit = compose(
  map(unnest),
  converge(zip, [
    keys,
    compose(tail, last, mapAccum((a, b) => [
      juxt([ minimum, open(a[2] || o(last, head)(b)), close, maximum ])(b), a
    ], []), values)
  ]),
  groupBy(o(converge(pair, [ getUTCDate, getUTCHours ]), head))
)
const zipKeysAndValues = o(map(unnest), converge(zip, [ keys, values ]))

const accumSeq = mapAccum((a, b) => [a + b, a + b], 0)
const composeProfitRows = compose(
  converge(zip, [
    map(o(date, path([ 'close', 'time' ]))),
    compose(last, accumSeq, map(prop('profitAmount')))
  ]),
  sortBy(path([ 'close', 'time' ])),
  filter(prop('close'))
)

export default class extends React.Component {
  static getInitialProps = async ({ query: { positions } }) => ({ positions })
  state = { loaded: false }

  componentDidMount() {
    this.setState({ loaded: true })
  }

  render() {
    const rows = this.props.positions.map(({ symbol, profitPerc, open, close }) => [
      symbol, `${profitPerc ? profitPerc.toFixed(2) + '% |' : ''} ${open.price} -> ${close ? close.price : '|'}`, new Date(open.time), close ? new Date(close.time) : new Date()
    ])
    const profitRows = composeProfitRows(this.props.positions)
    // console.log(profitRows)  
    console.log(getCandlesOfProfit(profitRows)) // date.getUTCHours()

    return !this.state.loaded ? <div/> : (
      <div>
        <Chart
          chartTitle='Waterfall'
          chartType='CandlestickChart'
          data={ [
            ['DATE',"val1","val2","val3","val4"],
            ...getCandlesOfProfit(profitRows)
            // ...map(([ date, prof ]) => [ date, prof, prof, prof, prof ],profitRows)
            // [ 'DAY 1', 0, 0, 2, 2 ],
            // [ 'DAY 2', 2, 2, 3, 3 ],
            // [ 'DAY 3', 3, 3, 1, 1 ],
            // [ 'DAY 4', 1, 1, 2.5, 2.5 ],
            // [ 'DAY 5', 2.5, 2.5, 4.5, 4.5 ],
            // [ 'DAY 6', 4.5, 4.5, 3.5, 3.5 ],
            // [ 'DAY 7', 3.5, 3.5, 7.5, 7.5 ],
          ] }
          options={ {
            legend: 'none',
            bar: { groupWidth: '100%' },
            candlestick: {
              fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
              risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
            }
          } }
          width='100%'
        />

        <Chart
          chartType='LineChart'
          columns={ [
            { label: 'time', type: 'datetime' },
            { label: 'balance', type: 'number' }
          ] }
          rows={ profitRows }
          legend={ true }
          options={ {
            hAxis: { title: 'Time' },
            vAxis: { title: 'Balance' },
            curveType: 'function'
          } }
          width="100%"
        />

        <Chart
          chartType='Timeline'
          graph_id='Timeline'
          columns={ [
            { id: 'symbol', type: 'string' },
            { id: 'info', type: 'string' },
            { id: 'opened', type: 'date' },
            { id: 'closed', type: 'date' }
          ] }
          rows={ rows }
          width="100%"
          height="100%"
          options={ {
            height: 800
          } }
          chartPackage={ [ 'timeline' ] }
        />
      </div>
    )
  }
}
