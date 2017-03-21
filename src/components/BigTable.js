import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'
import Table from 'components/table'

import throttle from 'react-throttle-render'
import deepEqual from 'deep-equal'

const limit = (arr, lim) => [ ...arr.slice(0, lim) ]
const summ = v => [ ...v, (v[1] * v[2]).toFixed(2) ]

class BigTable extends Component {

  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps.data, this.props.data)
  }

  render() {
    const { data, headers, title } = this.props
    const fullData = limit(data.map(summ).sort().reverse(), 100)
    return Table({ data: fullData, title, headers })
  }
}

BigTable.PropTypes = {
  data: PropTypes.array,
  headers: PropTypes.array,
  title: PropTypes.string
}

// const mapStateToProps = ({ bid }) => ({ data: bid })
export default function (mapStateToProps) {
  return hh(connect(mapStateToProps)(throttle(2000)(BigTable)))
}
