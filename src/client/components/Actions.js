import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import debounce from 'debounce'
import { hh, div, input, label } from 'react-hyperscript-helpers'
import { setThreshold } from 'shared/actions'

import ChunksAddForm from './ChunksAddForm'

class Actions extends Component {
  constructor(props) {
    super(props)
    this.refers = {}
    this.state = {
      sellChunkAmount: 0,
      buyChunkAmount: 0,
      flashBg: false,
      showBuyForm: true
    }
    this.changeThreshold = debounce(props.setThreshold, 500)
  }

  shouldComponentUpdate(props) {
    return props.currency.highestBid !== this.props.currency.highestBid
  }

  onThresholdChange(e) {
    this.changeThreshold(Number(e.target.value))
  }

  flashBackground() {
    this.setState({ flashBg: true })
    setTimeout(() => this.setState({ flashBg: false }), 200)
  }

  sendSells(data) {
    this.props.addChunks(data)
    this.flashBackground()
  }

  sendBuys(data) {
    this.props.addChunks(data)
    this.flashBackground()
  }

  render() {
    const { pairNames, currency, threshold, wallet } = this.props
    const isWalletIsset = !!(wallet[pairNames[0]] || wallet[pairNames[1]])
    const isCurrencyIsset = !!(currency && currency.highestBid)
    const styles = this.getStyles()

    return !(isWalletIsset && isCurrencyIsset) ?
    div({ style: styles.loading }, 'Получение баланса...') :
    div({ style: styles.root(this.state.flashBg) }, [
      div({ style: styles.box }, [

        // div({ style: styles.row }, [
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'Валюта'),
        //     div({ style: styles.info }, pairNames[0]),
        //     div({ style: styles.info }, pairNames[1])
        //   ]),
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'На счету'),
        //     div({ style: styles.info }, wallet[pairNames[0]]),
        //     div({ style: styles.info }, wallet[pairNames[1]])
        //   ]),
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'Доступно'),
        //     div({ style: styles.info }, freeCurrencies[0]),
        //     div({ style: styles.info }, freeCurrencies[1])
        //   ]),
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'В чанках'),
        //     div({ style: styles.info }, cropNumber(wallet[pairNames[0]] - freeCurrencies[0])),
        //     div({ style: styles.info }, cropNumber(wallet[pairNames[1]] - freeCurrencies[1]))
        //   ])
        // ]),

        ChunksAddForm(),
        div({ style: styles.row }, [
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Порог прибыли'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: threshold,
              onChange: e => this.onThresholdChange(e)
            })
          ])
        ])
      ])
    ])
  }

  getStyles() {
    return {
      root: animateState => ({
        width: '100vw',
        height: '94vh',
        background: animateState ? '#30db7d' : '#282c34',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: animateState ? 'background 0.05s' : 'background 1s ease-out'
      }),
      box: {
        maxWidth: '95vw',
        minWidth: '50vw',
        minHeight: '75vh'
      },
      loading: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      label: {
        display: 'block',
        margin: '0.5rem 0'
      },
      input: {
        fontSize: '1.2rem',
        padding: '.25rem .5rem'
      },
      row: {
        display: 'flex',
        justifyContent: 'center'
      },
      col: {
        margin: '.5rem'
      },
      removeBtn: {
        background: '#de6a70',
        color: '#fff',
        border: 0,
        fontSize: '.9rem',
        padding: '.65rem 1rem',
        margin: '2rem .2rem 0 .2rem'
      }
    }
  }
}

Actions.propTypes = {
  threshold: PropTypes.number,
  currency: PropTypes.object,
  wallet: PropTypes.object
}

const mapStateToProps = ({ threshold, currencies, currentPair, freeCurrencies, wallet }) => ({
  pairNames: currentPair.split('_'),
  currency: currencies[currentPair],
  freeCurrencies,
  threshold,
  wallet
})

export default hh(withRouter(connect(mapStateToProps, { setThreshold })(Actions)))
