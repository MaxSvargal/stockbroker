import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div, table, tbody, tr, th, td } from 'react-hyperscript-helpers'

const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}

class MyOrders extends Component {

  render() {
    const styles = this.getStyles()
    const headers = [ 'Time', 'Price', 'Amount', 'State' ]
    const { mySells, myFailureSells, myBuys, myFailureBuys } = this.props
    const data = [
      ...mySells.map(v => [ 'sell', ...v ]),
      ...myBuys.map(v => [ 'buy', ...v ]),
      ...myFailureBuys.map(v => [ 'fbuy', ...v ]),
      ...myFailureSells.map(v => [ 'fsell', ...v ])
    ].sort((a, b) => b[1] - a[1])

    return div([
      table({ style: styles.table }, [
        tbody({ style: styles.tbody }, [
          tr({ style: styles.tr }, headers.map(header =>
            th({ style: styles.th }, header))),

          data.map((item, i) =>
            tr({ key: i, style: styles.coloredTypedRow(item[0], item[5]) }, [
              td(item[1] && formatDate(item[1])),
              item.map(((col, j) =>
                (j > 1 && j < 4 && td({ key: j, style: styles.td }, col)) ||
                (j === 4 && td({ key: j, style: styles.td }, (() => (
                  (col === 0 && 'Создано транзакцией') ||
                  (col === -1 && 'Создано вручную') ||
                  `Закрыто #${col}`
                ))()))
              ))
            ]))
        ])
      ]),
      div({ style: styles.map }, [
        div({ style: { color: '#3c6a8e' } }, 'Открытая покупка | '),
        div({ style: { color: '#8e6e3c' } }, '| Открытая продажа'),
        div({ style: { color: '#4b4f58' } }, '| Закрытая покупка'),
        div({ style: { color: '#3e362f' } }, '| Закрытая продажа'),
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
      th: {
        background: '#152126',
        padding: '.25rem 0'
      },
      td: {
        padding: '.1rem .5rem'
      },
      coloredTypedRow: (type, state) => ({
        background:
          (type === 'buy' && (state === 0 ? '#3c6a8e' : '#4b4f58')) ||
          (type === 'sell' && (state === 0 ? '#8e6e3c' : '#3e362f')) ||
          (type === 'fbuy' && '#d8544c') ||
          (type === 'fsell' && '#d8544c')
      }),
      map: {
        display: 'flex',
        padding: '0 5vw'
      }
    }
  }
}

const mapStateToProps = ({ mySells, myFailureSells, myBuys, myFailureBuys }) =>
  ({ mySells, myFailureSells, myBuys, myFailureBuys })

export default hh(connect(mapStateToProps)(MyOrders))
