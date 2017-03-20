import { Component, PropTypes } from 'react'
import { hh, table, tbody, thead, tr, td, th, div } from 'react-hyperscript-helpers'
import throttle from 'react-throttle-render'
import deepEqual from 'deep-equal'

const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours}:${minutes.toString().length > 1 ? minutes : '0' + minutes}`
}


class Table extends Component {
  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps.data !== this.props.data)
  }

  render() {
    const { data, title, headers } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      table({ style: styles.table }, [
        tbody({ style: styles.tbody }, [
          tr({ style: styles.tr }, headers.map(header =>
            th({ style: styles.th }, header))),

          data.map((item, i) =>
            tr({ key: i, style: styles.coloredTypedRow(item.type) }, [
              td(item[0] && formatDate(item[0])),
              item.map(((col, j) =>
                j > 0 && td({ key: j, style: styles.td }, col)))
            ]))
        ])
      ])
    ])
  }

  getStyles() {
    return {
      root: {
      },
      table: {
        width: '100%'
      },
      thead: {

      },
      th: {
        background: '#152126',
        padding: '.25rem 0'
      },
      td: {
        padding: '.1rem .5rem'
      },
      tbody: {
        display: 'block',
        overflow: 'scroll',
        height: '50vh'
      },
      coloredTypedRow: type => {
        switch (type) {
          case 'sell': return { background: '#542a2a' }
          case 'buy': return { background: '#214a2c' }
          default: {}
        }
      }
    }
  }
}

Table.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  headers: PropTypes.array,
  title: PropTypes.string
}

export default hh(throttle(1000)(Table))
