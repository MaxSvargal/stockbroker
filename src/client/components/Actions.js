import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import debounce from 'debounce'
import { hh, div, input, label, button } from 'react-hyperscript-helpers'
import { setThreshold, sendSells, sendBuys, removeOpenBuys, removeOpenSells } from 'shared/actions'

import ChunksAddForm from './ChunksAddForm'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.refers = {}
    this.state = {
      sellChunkAmount: 0,
      buyChunkAmount: 0,
      flashBg: false,
      showBuyForm: true
    }
    this.sendSells = this.sendSells.bind(this)
    this.sendBuys = this.sendBuys.bind(this)
    this.removeOpenSells = this.removeOpenSells.bind(this)
    this.removeOpenBuys = this.removeOpenBuys.bind(this)
    this.changeThreshold = debounce(props.setThreshold, 500)
  }

  onThresholdChange(e) {
    this.changeThreshold(Number(e.target.value))
  }

  flashBackground() {
    this.setState({ flashBg: true })
    setTimeout(() => this.setState({ flashBg: false }), 200)
  }

  removeOpenSells() {
    this.props.removeOpenSells()
    this.flashBackground()
  }

  removeOpenBuys() {
    this.props.removeOpenBuys()
    this.flashBackground()
  }

  sendSells(data) {
    this.props.sendSells(data)
    this.flashBackground()
  }

  sendBuys(data) {
    this.props.sendBuys(data)
    this.flashBackground()
  }

  render() {
    const { pairNames, currency /* , freeCurrencies */, threshold, wallet } = this.props
    const isWalletIsset = !!(wallet[pairNames[0]] || wallet[pairNames[1]])
    const isCurrencyIsset = !!(currency && currency.highestBid)
    const styles = this.getStyles()
    console.log({ isWalletIsset, isCurrencyIsset });

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

        ChunksAddForm({
          pairNames,
          rate: currency && currency.highestBid,
          amount: wallet[pairNames[1]],
          onCreateBuy: this.sendBuys,
          onCreateSell: this.sendSells
        }),
        div({ style: styles.row }, [
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Порог прибыли'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: threshold,
              onChange: e => this.onThresholdChange(e)
            })
          ]),
          div({ style: styles.col }, [
            button({
              style: styles.removeBtn,
              onClick: this.removeOpenSells
            }, 'Удалить открытые продажи')
          ]),
          div({ style: styles.col }, [
            button({
              style: styles.removeBtn,
              onClick: this.removeOpenBuys
            }, 'Удалить открытые покупки')
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

Settings.propTypes = {
  threshold: PropTypes.number,
  currency: PropTypes.object,
  wallet: PropTypes.object
}

const mapStateToProps = ({ threshold, currencies, currentPair, freeCurrencies, wallet }) =>
  ({
    pairNames: currentPair.split('_'),
    currency: currencies[currentPair],
    freeCurrencies,
    threshold,
    wallet
  })

const dispatchToProps = {
  setThreshold, sendSells, sendBuys, removeOpenBuys, removeOpenSells
}

export default hh(withRouter(connect(mapStateToProps, dispatchToProps)(Settings)))
