import React, { Component } from 'react'
import { o, map, nth, converge, pair, path, prop } from 'ramda'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'

import CandlesChart from './candlesChart'

const Container = glamorous.div(({ positive }) => ({
  height: '8rem',
  position: 'relative',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  alignContent: 'stretch',
  justifyContent: 'space-evently',
  color: positive ? '#4B6227' : '#804743',
  background: '#fafafa',
  borderTop: `1px solid ${positive ? '#D7EDB6' : '#fff'}`,
  borderBottom: `1px solid ${positive ? '#D7EDB6' : '#fce4ec'}`
}))

const HeadTitle = glamorous.div(({ positive }) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '3.14rem',
  wordSpacing: '1rem',
  margin: '0 1rem',
  color: positive ? '#c0ca33' : '#f48fb1'
}))

export default class extends Component {
  state = { candles: [] }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.ticker !== nextProps.ticker ||
      this.state.candles.length !== nextState.candles.length // TODO: fix it
  }

  async componentDidMount () {
    const res = await window.fetch(`${location.origin}/api/candles/${this.props.position.symbol}/30m/48`)
    const candles = await res.json()
    this.setState({ candles: candles })
  }

  static getPriceWProfit (price) {
    return price + (price * 0.007)
  }

  render() {
    const { position, ticker } = this.props
    const { getPriceWProfit } = this.constructor

    const openPrice = path([ 'open', 'price' ], position)
    const candles = map(o(parseFloat, nth(4)), this.state.candles)
    const chadlesChartData = candles.map((v, i) => [ i, v, getPriceWProfit(openPrice) ])

    return (
      <Container positive={ ticker > openPrice } >
        <Div flex='10'>
          <CandlesChart data={ chadlesChartData } type={ ticker > openPrice ? 'positive' : 'default' } />
          <HeadTitle positive={ ticker > openPrice }>{ prop('symbol', position) }</HeadTitle>
        </Div>
        <Div flex='2'>
          <Div display='flex' margin='0 1rem' lineHeight='1.8rem' >
            <Div fontSize='1.14rem' color={ticker > openPrice ? '#9e9d24' : '#d84315' }>
              <div>{ ticker || '~' }</div>
              <div>{ getPriceWProfit(openPrice).toFixed(8) }</div>
              <div>{ openPrice }</div>
              <Div fontSize='.75em'>{ moment(path([ 'open', 'time' ], position)).format('HH:mm, D MMM') }</Div>
            </Div>
            <Div fontSize='.8rem' color={ticker > openPrice ? '#c0ca33' : '#ef6c00' } marginLeft='.5rem'>
              <div>curent</div>
              <div>expect</div>
              <div>bought</div>
              <div>from</div>
            </Div>
          </Div>
        </Div>
      </Container>
    )
  }
}