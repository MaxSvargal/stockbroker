import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

class CurrencyStats extends Component {

  render() {
    const { currency } = this.props
    const styles = this.getStyles()

    return !currency ? div('Ожидание обновления курса...') :
      div({ style: styles.root }, [
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
  ({ currency: currencies[currentPair] })

export default hh(connect(mapStateToProps)(CurrencyStats))
