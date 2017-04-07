import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import { removeChunk } from 'shared/actions'

import ChunksAddForm from './ChunksAddForm'
import TransactionsTable from './TransactionsTable'

class Transactions extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      ChunksAddForm(),
      TransactionsTable(),
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
      root: {
        padding: '1rem 2vw'
      },
      map: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5vw'
      }
    }
  }
}

const mapStateToProps = ({ transactions }) => ({ transactions })
export default hh(connect(mapStateToProps, { removeChunk })(Transactions))
