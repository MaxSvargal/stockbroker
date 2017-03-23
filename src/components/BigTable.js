import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'
import throttle from 'react-throttle-render'
import deepEqual from 'deep-equal'

import Table from 'components/Table'

const limit = (arr, lim) => [ ...arr.slice(0, lim) ]
const summ = v => [ ...v, (v[1] * v[2]).toFixed(2) ]

class BigTable extends Component {

  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps.data, this.props.data)
  }

  render() {
    const { data, headers, title } = this.props
    const fullData = limit(data.map(summ).slice().sort(), 100)
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
