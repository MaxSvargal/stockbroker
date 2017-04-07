import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div, table, tbody, tr, th, td, button } from 'react-hyperscript-helpers'
import { removeChunk } from 'shared/actions'

import ChunksAddForm from './ChunksAddForm'

const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}

class Transactions extends Component {
  render() {
    const styles = this.getStyles()
    const headers = [ 'Time', 'Price', 'Amount' ]
    const { transactions } = this.props
    const transactionsArray = Object.keys(transactions)
      .reduce((arr, key) => [ ...arr, Object.assign({}, transactions[key], { id: key }) ], [])
      .sort((a, b) => a.created < b.created)

    return div([
      ChunksAddForm(),
      table({ style: styles.table }, [
        tbody({ style: styles.tbody }, [
          tr({ style: styles.tr }, headers.map(header =>
            th({ style: styles.th }, header))),

          transactionsArray.map(({ id, type, active, created, updated, rate, amount }) =>
            tr({ style: styles.coloredTypedRow(type, active), key: id }, [
              td({ style: styles.col }, formatDate(updated || created)),
              td({ style: styles.col }, rate),
              td({ style: styles.col }, amount),
              td({ style: { width: '3rem' } }, [
                active && button({
                  style: styles.removeBtn,
                  onClick: () => this.props.removeChunk(id)
                }, 'Удалить')
              ])
            ]))
        ])
      ]),


      // div({ style: styles.table }, [
      //   div({ style: styles.header }, [
      //     div()
      //   ]),
      //   div({ style: styles.body },
      //     transactionsArray.map(({ id, created, updated, rate, amount }) =>
      //       div({ style: styles.row, key: id }, [
      //         div({ style: styles.col }, formatDate(updated || created)),
      //         div({ style: styles.col }, rate),
      //         div({ style: styles.col }, amount)
      //       ]))
      //   )
      // ]),
      div({ style: styles.map }, [
        div({ style: { color: '#3c6a8e' } }, '● Открытая покупка'),
        div({ style: { color: '#8e6e3c' } }, '● Открытая продажа'),
        div({ style: { color: '#4b4f58' } }, '● Закрытая покупка'),
        div({ style: { color: '#3e362f' } }, '● Закрытая продажа'),
      ])
    ])
  }

  getStyles() {
    return {
      table: {
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '5vw'
      },
      col: {
        padding: '0.15rem .25rem'
      },
      th: {
        background: '#152126',
        padding: '.25rem 0'
      },
      td: {
        padding: '.1rem .5rem'
      },
      coloredTypedRow: (type, active) => ({
        background:
          (type === 'buy' && (active === true ? '#3c6a8e' : '#4b4f58')) ||
          (type === 'sell' && (active === true ? '#8e6e3c' : '#3e362f')) ||
          (type === 'fbuy' && '#d8544c') ||
          (type === 'fsell' && '#d8544c')
      }),
      map: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5vw'
      },
      removeBtn: {
        background: '#6c2b35',
        border: 0,
        color: '#fff',
        padding: '0.25rem .5rem'
      }
    }
  }
}

const mapStateToProps = ({ transactions }) => ({ transactions })
export default hh(connect(mapStateToProps, { removeChunk })(Transactions))
