import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, h, div, span } from 'react-hyperscript-helpers'
import { NavLink, Route, Switch } from 'react-router-dom'

import ChunksAddForm from './ChunksAddForm'
import CurrencyStats from './CurrencyStats'
import TransactionsTable from './TransactionsTable'

class Transactions extends Component {
  render() {
    const styles = this.getStyles()
    const { transactions } = this.props
    const getTransactionsKeysByActive = active =>
      Object.keys(transactions)
        .filter(key => transactions[key].active === active)
        .map(key => Object.assign({}, transactions[key], { id: key }))

    const activeTransactions = getTransactionsKeysByActive(true).sort((a, b) => b.created - a.created)
    const completeTransactions = getTransactionsKeysByActive(false).sort((a, b) => b.updated - a.updated)

    return div({ style: styles.root }, [
      div({ style: styles.row }, [
        CurrencyStats(),
        ChunksAddForm()
      ]),
      div({ style: styles.tabs }, [
        h(NavLink, {
          to: '/transactions/active',
          style: styles.link,
          activeStyle: styles.activeLink,
          exact: true
        }, [ span('Активные') ]),
        h(NavLink, {
          to: '/transactions/complete',
          style: styles.link,
          activeStyle: styles.activeLink
        }, [ span('Завершённые') ])
      ]),
      div({ style: styles.tableBox }, [
        h(Switch, [
          h(Route, {
            exact: true,
            path: '/transactions/(active)?',
            render: () => TransactionsTable({ data: activeTransactions })
          }),
          h(Route, {
            path: '/transactions/complete',
            render: () => TransactionsTable({ data: completeTransactions })
          })
        ]),
      ]),
      // div({ style: styles.map }, [
      //   div({ style: { color: '#3c6a8e' } }, '● Открытая покупка'),
      //   div({ style: { color: '#8e6e3c' } }, '● Открытая продажа'),
      //   div({ style: { color: '#4b4f58' } }, '● Закрытая покупка'),
      //   div({ style: { color: '#3e362f' } }, '● Закрытая продажа'),
      // ])
    ])
  }

  getStyles() {
    return {
      root: {
        padding: '1rem 2vw'
      },
      row: {
        display: 'flex'
      },
      tabs: {
        display: 'flex',
        justifyContent: 'space-around',
        background: '#2c323b',
        marginTop: '1rem'
      },
      link: {
        color: '#fff',
        fontSize: '1.2rem',
        padding: '.5rem 0',
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecoration: 'none'
      },
      activeLink: {
        background: '#684d99'
      },
      tableBox: {
        maxHeight: '92vh',
        overflowY: 'scroll'
      }
      // map: {
      //   display: 'flex',
      //   justifyContent: 'space-between',
      //   padding: '0 5vw'
      // }
    }
  }
}

const mapStateToProps = ({ transactions }) => ({ transactions })
export default hh(connect(mapStateToProps)(Transactions))
