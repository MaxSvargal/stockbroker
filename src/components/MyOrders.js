import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

import Table from 'components/Table'

class MyOrders extends Component {

  render() {
    const { mySells, myFailureSells, myBuys, myFailureBuys } = this.props
    const headers = [ 'Time', 'Price', 'Amount', 'OrderId', 'State' ]
    const styles = this.getStyles()

    return div({ style: styles.box }, [
      div({ style: styles.row }, [
        div({ style: styles.col }, [
          Table({ data: mySells.reverse(), title: 'Продажи', headers })
        ]),
        div({ style: styles.col }, [
          Table({ data: myBuys.reverse(), title: 'Покупки', headers })
        ])
      ]),
      div({ style: styles.row }, [
        myFailureSells.length > 0 && div({ style: styles.col }, [
          Table({ data: myFailureSells.reverse(), title: 'Продажи с ошибками', headers })
        ]),
        myFailureBuys.length > 0 && div({ style: styles.col }, [
          Table({ data: myFailureBuys.reverse(), title: 'Покупки с ошибками', headers })
        ])
      ])
    ])
  }

  getStyles() {
    return {
      row: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '5vh 0',
        overflow: 'hidden'
      },
      col: {
        overflowY: 'scroll',
        height: '38vh'
      }
    }
  }
}

const mapStateToProps = ({ mySells, myFailureSells, myBuys, myFailureBuys }) =>
  ({ mySells, myFailureSells, myBuys, myFailureBuys })

export default hh(connect(mapStateToProps)(MyOrders))
