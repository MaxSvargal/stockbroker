import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div, input, label, span, button } from 'react-hyperscript-helpers'
import BigNumber from 'bignumber.js'
import { requestNewChunks } from '../../shared/actions'

class ChunksAddForm extends Component {
  constructor(props) {
    super(props)
    this.refers = {}
    this.state = {
      chunkAmount: 0,
      currencyChunkAmount: 0,
      currencyTotalAmount: 0
    }
  }

  calculate() {
    const { amount, chunks, rate } = this.refers

    const chunkAmount = new BigNumber(0)
      .plus(amount.value || 0)
      .div(chunks.value || 1)
      .toFixed(8)

    const currencyTotalAmount = new BigNumber(0)
      .plus(rate.value || 1)
      .times(amount.value || 1)
      .toFixed(8)

    const currencyChunkAmount = new BigNumber(0)
      .plus(currencyTotalAmount)
      .div(chunks.value || 1)
      .toFixed(8)

    this.setState({ chunkAmount, currencyChunkAmount, currencyTotalAmount })
  }

  onCreateBuy() {
    const { rate, chunks } = this.refers
    this.props.requestNewChunks({
      type: 'buy',
      rate: Number(rate.value),
      amount: Number(this.state.chunkAmount),
      num: Number(chunks.value)
    })
  }

  onCreateSell() {
    const { rate, chunks } = this.refers
    this.props.requestNewChunks({
      type: 'sell',
      rate: Number(rate.value),
      amount: Number(this.state.chunkAmount),
      num: Number(chunks.value)
    })
  }

  render() {
    const { amount, rate, pairNames } = this.props
    const styles = this.getStyles()

    return div({ style: styles.row }, [
      div({ style: styles.col }, [
        label({ style: styles.label }, `Объём ${pairNames[1]}`),
        input({
          type: 'number',
          style: styles.input,
          defaultValue: amount,
          ref: ref => (this.refers.amount = ref),
          onChange: () => this.calculate()
        }),

        label({ style: styles.label }, `Всего ${pairNames[0]}`),
        span({
          type: 'number',
          style: styles.output },
          this.state.currencyTotalAmount)
      ]),
      div({ style: styles.col }, [
        label({ style: styles.label }, 'Чанков'),
        input({
          type: 'number',
          style: styles.input,
          defaultValue: 0,
          ref: ref => (this.refers.chunks = ref),
          onChange: () => this.calculate()
        }),

        label({ style: styles.label }, `${pairNames[1]} в чанке`),
        span({
          type: 'number',
          style: styles.output },
          this.state.chunkAmount)
      ]),
      div({ style: styles.col }, [
        label({ style: styles.label }, `Цена для чанка ${pairNames[0]}`),
        input({
          type: 'number',
          style: styles.input,
          defaultValue: rate,
          ref: ref => (this.refers.rate = ref),
          onChange: () => this.calculate()
        }),

        label({ style: styles.label }, `${pairNames[0]} в чанке`),
        span({
          type: 'number',
          style: styles.output },
          this.state.currencyChunkAmount)
      ]),
      div({ style: styles.actionsRow }, [
        button({
          style: styles.createBtn,
          onClick: () => this.onCreateBuy() },
          'Создать покупки'),
        button({
          style: styles.createBtn,
          onClick: () => this.onCreateSell() },
          'Создать продажи')
      ])
    ])
  }

  getStyles() {
    return {
      label: {
        display: 'block',
        padding: '1rem 0'
      },
      input: {
        fontSize: '1.2rem',
        padding: '.25rem .5rem'
      },
      row: {
        display: 'flex',
        flexWrap: 'no-wrap',
        justifyContent: 'space-between',
        padding: '0 0 1rem 0',
        width: '100%'
      },
      col: {
        flexGrow: 1,
        padding: '0 .25rem'
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
        padding: '.5rem 0',
        margin: '.25rem .5rem',
        minWidth: '16rem'
      },
      actionsRow: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: '2.5rem'
      }
    }
  }
}

const mapStateToProps = ({ currencies, currentPair, wallet }) => ({
  pairNames: currentPair.split('_'),
  amount: wallet[currentPair.split('_')[1]],
  rate: currencies[currentPair] && currencies[currentPair].last
})

export default hh(connect(mapStateToProps, { requestNewChunks })(ChunksAddForm))
