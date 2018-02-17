import React from 'react'
import { Chart } from 'react-google-charts'
import { mapAccum, last, o, map, compose, filter, path, prop, zip, converge, constructN, sortBy } from 'ramda'

import Position from './components/position'

const date = constructN(1, Date)
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

    return !this.state.loaded ? <div/> : (
      <div>
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
