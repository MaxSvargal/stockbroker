import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, h1, h2, div, span } from 'react-hyperscript-helpers'

import FinalCurrentResult from './FinalCurrentResult'

class CurrencyStats extends Component {

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
            h2({ style: styles.h2 }, currency.last)
          ]),
          div({ style: styles.info }, [
            div({ style: styles.bigInfo }, [
              div({ style: styles.ask }, [ currency.lowestAsk, ' cпрос' ]),
              div({ style: styles.bid }, [ currency.highestBid, ' предложение' ])
            ]),
            div([ currency.hrLow, '/', currency.hrHigh, ' за сутки' ]),
            div([ 'Сдвиг: ', currency.percentChange, '%' ]),
            div([ 'Объём: ', currency.baseVolume ]),
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
        margin: '1rem 0 2.5rem 0'
      },
      h2: {
        fontSize: '4rem',
        margin: '3.5rem 0',
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
      ask: {
        color: '#cf9a69'
      },
      bid: {
        color: '#67aee6'
      }
    }
  }
}

const mapStateToProps = ({ currencies, currentPair }) =>
  ({ currency: currencies[currentPair], currentPair })

export default hh(connect(mapStateToProps)(CurrencyStats))
