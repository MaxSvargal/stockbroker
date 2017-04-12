import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div, table, tbody, tr, th, td, button } from 'react-hyperscript-helpers'
import { removeChunk } from 'shared/actions'

const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}

class TransactionsTable extends Component {
  render() {
    const styles = this.getStyles()
    const headers = [ 'Время/обн.', 'Цена', 'Объём/профит' ]
    const { transactions } = this.props
    const transactionsArray = Object.keys(transactions)
      .map(key => Object.assign({}, transactions[key], { id: key }))
      // NaN bug fix
      // TODO: remove after drop db
      .filter(obj => Boolean(obj.created) && !obj.removed)
      .sort((a, b) => b.created - a.created)

    return div([
      table({ style: styles.table }, [
        tbody({ style: styles.tbody }, [
          tr({ style: styles.tr }, headers.map(header =>
            th({ style: styles.th }, header))),

          transactionsArray.map(({ id, type, active, created, updated, rate, amount, profit, error }) =>
            tr({ style: styles.coloredTypedRow(type, active, error), key: id }, [
              td({ style: styles.col }, updated ?
                [ formatDate(created), '/', formatDate(updated) ] :
                formatDate(created)),
              td({ style: styles.col }, rate),
              td({ style: styles.col }, profit ? [ amount, ' / ', profit ] : amount),
              td({ style: { width: '3rem' } }, [
                active && button({
                  style: styles.removeBtn,
                  onClick: () => this.props.removeChunk(id)
                }, 'Удалить')
              ])
            ]))
        ])
      ])
    ])
  }

  getStyles() {
    return {
      table: {
        width: '100%',
        overflowY: 'auto',
        maxHeight: '85vh'
      },
      col: {
        padding: '0.15rem .25rem'
      },
      th: {
        background: '#152126',
        padding: '.25rem 0'
      },
      coloredTypedRow: (type, active, error) => ({
        background:
          (type === 'buy' && (active === true ? '#3c6a8e' : '#4b4f58')) ||
          (type === 'sell' && (active === true ? '#8e6e3c' : '#3e362f')) ||
          (error && '#d8544c')
      }),
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
export default hh(connect(mapStateToProps, { removeChunk })(TransactionsTable))
