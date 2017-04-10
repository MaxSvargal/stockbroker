import { Component } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'
import Table from './Table'

class TradeTable extends Component {
  render() {
    const { data, currentPair } = this.props
    const pairNames = currentPair.split('_')
    return Table({ data, headers: [ 'Date', `Price ${pairNames[0]}`, `Amount ${pairNames[1]}`, `Total ${pairNames[0]}` ] })
  }
}

const mapStateToProps = ({ buy, sell, currentPair }) => {
  const partOfSells = sell.map(v =>
    Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))

  const partOfBuys = buy.map(v =>
    Object.defineProperty(v, 'type', { value: 'buy', enumerable: false }))

  const mergedArrays = [ ...partOfSells, ...partOfBuys ].sort((a, b) => a[0] < b[0])

  return { data: mergedArrays, currentPair }
}

export default hh(connect(mapStateToProps)(TradeTable))
