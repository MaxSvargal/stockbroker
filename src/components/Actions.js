import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import debounce from 'debounce'
import BigNumber from 'bignumber.js'
// import { cropNumber } from 'utils'
import { hh, h2, div, input, label, span, button } from 'react-hyperscript-helpers'
import { setThreshold, sendSells, sendBuys, removeOpenBuys, removeOpenSells } from 'actions'

const assign = (from, to) => Object.assign({}, from, to)

class Settings extends Component {
  constructor(props) {
    super(props)
    this.refers = {}
    this.state = {
      sellChunkAmount: 0,
      buyChunkAmount: 0,
      flashBg: false
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

  sendSells() {
    this.props.sendSells({
      rate: Number(this.refers.sellRate.value),
      amount: Number(this.state.sellChunkAmount),
      chunksNum: Number(this.refers.sellChunks.value)
    })
    this.flashBackground()
  }

  sendBuys() {
    this.props.sendBuys({
      rate: Number(this.refers.buyRate.value),
      amount: Number(this.state.buyChunkAmount),
      chunksNum: Number(this.refers.buyChunks.value)
    })
    this.flashBackground()
  }

  calculateBuys() {
    const { buyAmount, buyChunks } = this.refers
    this.setState({
      buyChunkAmount: new BigNumber(buyAmount.value || 0)
        .div(buyChunks.value || 0)
        .toFixed(8)
    })
  }

  calculateSells() {
    const { sellAmount, sellRate, sellChunks } = this.refers
    this.setState({
      sellChunkAmount: new BigNumber(sellAmount.value || 0)
        .div(sellChunks.value || 0)
        .div(sellRate.value || 0)
        .toFixed(8)
    })
  }

  render() {
    const { pairNames, currency /* , freeCurrencies */, threshold, wallet } = this.props
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
        ]),

        div({ style: styles.row }, [
          h2({ style: styles.title }, `Создать покупки (задача продать ${pairNames[1]})`)
        ]),
        div({ style: styles.row }, [
          div({ style: styles.col }, [
            label({ style: styles.label }, `Объём ${pairNames[1]}`),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: wallet[pairNames[1]],
              ref: ref => (this.refers.buyAmount = ref),
              onChange: e => this.calculateBuys(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Чанков для покупки'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: 0,
              ref: ref => (this.refers.buyChunks = ref),
              onChange: e => this.calculateBuys(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Цена покупки'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: currency && currency.highestBid,
              ref: ref => (this.refers.buyRate = ref),
              onChange: e => this.calculateBuys(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, `${pairNames[1]} в чанке`),
            span({
              type: 'number',
              style: styles.output },
              this.state.buyChunkAmount
            )
          ]),
          div({ style: styles.col }, [
            button({
              style: styles.createBtn,
              onClick: this.sendBuys
            }, 'Создать')
          ])
        ]),

        div({ style: styles.row }, [
          h2({ style: styles.title }, `Создать продажи (задача купить ${pairNames[1]})`)
        ]),
        div({ style: styles.row }, [
          div({ style: styles.col }, [
            label({ style: styles.label }, `Объём ${pairNames[0]}`),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: wallet[pairNames[0]],
              ref: ref => (this.refers.sellAmount = ref),
              onChange: e => this.calculateSells(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Чанков для продажи'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: 0,
              ref: ref => (this.refers.sellChunks = ref),
              onChange: e => this.calculateSells(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Цена продажи'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: currency && currency.lowestAsk,
              ref: ref => (this.refers.sellRate = ref),
              onChange: e => this.calculateSells(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, `${pairNames[1]} в чанке`),
            span({
              style: styles.output },
              this.state.sellChunkAmount
            )
          ]),
          div({ style: styles.col }, [
            button({
              style: styles.createBtn,
              onClick: this.sendSells
            }, 'Создать')
          ])
        ]),

        div({ style: styles.row }, [
          div({ style: assign(styles.col, styles.controls) }, [
            button({
              style: styles.removeBtn,
              onClick: this.removeOpenSells
            }, 'Удалить открытые продажи'),
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
        height: '100vh',
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
        flexWrap: 'wrap',
        margin: '0 .5rem',
        padding: '0.5rem 0.5rem'
      },
      col: {
        margin: '.5rem'
      },
      controls: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '2rem'
      },
      output: {
        fontSize: '2rem',
        display: 'inline-block',
        minWidth: '12rem'
      },
      createBtn: {
        background: '#54a9eb',
        color: '#fff',
        border: 0,
        fontSize: '1.2rem',
        padding: '.45rem 1rem',
        margin: '2rem 0'
      },
      removeBtn: {
        background: '#de6a70',
        color: '#fff',
        border: 0,
        fontSize: '1.1rem',
        padding: '.45rem 1rem',
        margin: '0 .5rem'
      },
      title: {
        margin: '0 .5rem',
        color: '#cf9a6b'
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
