import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, h1, div } from 'react-hyperscript-helpers'
import Table from 'components/table'

const limit = (arr, lim) => [ ...arr.slice(0, lim) ]
const summ = v => [ ...v, (v[1] * v[2]).toFixed(2) ]

class BidTable extends Component {
  render() {
    const { data } = this.props
    const styles = this.getStyles()

    return Table({
      data,
      title: 'Продажа',
      headers: [ 'Date', 'Price', 'ETH', 'USDT' ]
    })
  }

  getStyles() {
    return {
      root: {
        lineHeight: '1.8rem',
        fontWeight: 'bold'
      },
      h1: {
        fontSize: '3rem'
      }
    }
  }
}

const mapStateToProps = ({ bid }) =>
  ({ data: limit(bid.map(summ).sort().reverse(), 150) })

export default hh(connect(mapStateToProps)(BidTable))
