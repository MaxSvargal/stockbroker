import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, h1, h2, h3, div, span } from 'react-hyperscript-helpers'
import { toFixedRate } from '../../shared/utils'

import FinalCurrentResult from './FinalCurrentResult'

class CurrencyRate extends Component {

  componentWillReceiveProps(nextProps) {
    /* eslint class-methods-use-this: 0 */
    document && nextProps.currency && (document.title = nextProps.currency.last)
  }

  render() {
    const { currency, currentPair } = this.props
    const styles = this.getStyles()

    return !currency ? div('Ожидание обновления курса...') :
      div({ style: styles.root }, [
        div({ style: styles.row }, [
          div([
            h1({ style: styles.h1 }, [
              span(currentPair),
              span({ style: styles.finalCurrent }, [ FinalCurrentResult() ]),
            ]),
            h2({ style: styles.h2 }, toFixedRate(currency.last)),
            div({ style: styles.askbid }, [
              h3({ style: styles.ask }, toFixedRate(currency.lowestAsk)),
              span(' / '),
              h3({ style: styles.bid }, toFixedRate(currency.highestBid))
            ])
          ])
        ])
      ])
  }

  getStyles() {
    return {
      root: {
        lineHeight: '1.8rem'
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      h1: {
        fontSize: '3.5rem',
        margin: '1rem 0 0 0'
      },
      h2: {
        fontSize: '3.25rem',
        margin: '2.5rem 0 1.25rem 0',
        color: '#e352c9'
      },
      finalCurrent: {
        display: 'inline-block',
        position: 'relative'
      },
      info: {
        minWidth: '19rem'
      },
      bigInfo: {
        fontWeight: 'bold',
        fontSize: '1.1rem'
      },
      askbid: {
        fontSize: '1.2rem'
      },
      ask: {
        color: '#cf9a69',
        display: 'inline'
      },
      bid: {
        color: '#67aee6',
        display: 'inline'
      }
    }
  }
}

const mapStateToProps = ({ currencies, currentPair }) =>
  ({ currency: currencies[currentPair], currentPair })

export default hh(connect(mapStateToProps)(CurrencyRate))
