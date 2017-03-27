import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import debounce from 'debounce'
import { hh, h2, div, input, label, span, button } from 'react-hyperscript-helpers'
import { setThreshold, setChunksNumbers, sendSells, sendBuys } from 'actions'
import { CURRENT_PAIR } from 'const'

import CloseIcon from 'components/CloseIcon'

const pairNames = CURRENT_PAIR.split('_')

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
    this.changeThreshold = debounce(props.setThreshold, 500)
  }

  static getChunkAmount(value, numOfParts) {
    return Number((value / numOfParts).toString().slice(0, 10))
  }

  onThresholdChange(e) {
    this.changeThreshold(Number(e.target.value))
  }

  flashBackground() {
    this.setState({ flashBg: true })
    setTimeout(() => this.setState({ flashBg: false }), 200)
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

  calculateSells() {
    const { sellAmount, sellChunks, sellRate } = this.refers
    this.setState({
      sellChunkAmount: Settings.getChunkAmount(sellAmount.value / sellRate.value, sellChunks.value)
    })
  }

  calculateBuys() {
    const { buyAmount, buyChunks } = this.refers
    this.setState({
      buyChunkAmount: Settings.getChunkAmount(buyAmount.value, buyChunks.value)
    })
  }

  render() {
    const { threshold, currency, chunksNumbers, wallet } = this.props
    const isWalletIsset = !!(wallet[pairNames[0]] || wallet[pairNames[1]])
    const isCurrencyIsset = !!(currency && currency.highestBid)
    const styles = this.getStyles()

    return !(isWalletIsset && isCurrencyIsset) ?
    div({ style: styles.loading }, 'Получение баланса...') :
    div({ style: styles.root(this.state.flashBg) }, [
      div({ style: styles.box }, [
        CloseIcon(),
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
          h2({ style: styles.title }, 'Продажа')
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
              defaultValue: chunksNumbers[0],
              ref: ref => (this.refers.sellChunks = ref),
              onChange: e => this.calculateSells(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Цена продажи'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: currency && currency.highestBid,
              ref: ref => (this.refers.sellRate = ref),
              onChange: e => this.calculateSells(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, `${pairNames[1]} в чанке`),
            span({
              type: 'number',
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
          h2({ style: styles.title }, 'Покупка')
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
              defaultValue: chunksNumbers[1],
              ref: ref => (this.refers.buyChunks = ref),
              onChange: e => this.calculateBuys(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, 'Цена покупки'),
            input({
              type: 'number',
              style: styles.input,
              defaultValue: currency && currency.lowestAsk,
              ref: ref => (this.refers.buyRate = ref),
              onChange: e => this.calculateBuys(e)
            })
          ]),
          div({ style: styles.col }, [
            label({ style: styles.label }, `${pairNames[1]} в чанке`),
            span({
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
        margin: '1rem .5rem'
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
      title: {
        margin: '0 .5rem',
        color: '#cf9a6b'
      }
    }
  }
}

Settings.propTypes = {
  threshold: PropTypes.number,
  currencies: PropTypes.array,
  currency: PropTypes.object
}

const mapStateToProps = ({ threshold, chunksNumbers, currencies, wallet }) =>
  ({ threshold, chunksNumbers, currency: currencies[CURRENT_PAIR], wallet })

const dispatchToProps = { setThreshold, setChunksNumbers, sendSells, sendBuys }

export default hh(withRouter(connect(mapStateToProps, dispatchToProps)(Settings)))
