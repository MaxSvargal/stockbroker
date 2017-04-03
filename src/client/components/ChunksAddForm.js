import { Component } from 'react'
import { hh, div, input, label, span, button } from 'react-hyperscript-helpers'
import BigNumber from 'bignumber.js'

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
      .times(chunks.value || 1)
      .toFixed(8)

    const currencyChunkAmount = new BigNumber(0)
      .plus(currencyTotalAmount)
      .div(chunks.value || 1)
      .toFixed(8)

    this.setState({ chunkAmount, currencyChunkAmount, currencyTotalAmount })
  }

  onCreateBuy() {
    const { rate, chunks } = this.refers
    this.props.onCreateBuy({
      rate: Number(rate.value),
      amount: Number(this.state.chunkAmount),
      chunksNum: Number(chunks.value)
    })
  }

  onCreateSell() {
    const { rate, chunks } = this.refers
    this.props.onCreateSell({
      rate: Number(rate.value),
      amount: Number(this.state.chunkAmount),
      chunksNum: Number(chunks.value)
    })
  }

  render() {
    const { pairNames, rate, amount } = this.props
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
        padding: '2rem 0 1rem'
      },
      input: {
        fontSize: '1.2rem',
        padding: '.25rem .5rem'
      },
      row: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '0 .5rem',
        padding: '0.5rem 0.5rem'
      },
      col: {
        margin: '.5rem'
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
        padding: '1rem 3rem',
        margin: '4rem 1rem'
      },
      actionsRow: {
        display: 'flex',
        minWidth: '55vw',
        justifyContent: 'space-between'
      }
    }
  }
}

export default hh(ChunksAddForm)
