import React, { Component } from 'react'

export default class extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.ticker !== nextProps.ticker
  }

  render() {
    const styles = this.getStyles()
    const { position: p, ticker } = this.props

    return (
      <div style={ styles.root(p.open.price, ticker) }>
        <div style={ styles.header } >{ p.symbol }</div>
        <div style={ styles.prices } >
          <div style={ styles.column } >
            <div>bought</div>
            <div>expect</div>
            <div>curent</div>
          </div>
          <div style={ styles.column } >
            <div><strong>{ p.open.price }</strong></div>
            <div><strong>{ (p.open.price + (p.open.price * 0.007)).toFixed(8) }</strong></div>
            <div><strong>{ ticker }</strong></div>
          </div>
        </div>
      </div>
    )
  }

  getStyles() {
    return {
      root: (price, ticker) => ({
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        alignContent: 'stretch',
        justifyContent: 'center',
        padding: '1vw',
        color: ticker > price ? '#4B6227' : '#804743',
        background: ticker > price ? '#F3F7EE' : '#FFF7F6',
        border: `1px solid ${ticker > price ? '#D7EDB6' : '#FFDCD9'}`,
        flexGrow: 1,
        flexBasis: 0
      }),
      header: {
        marginRight: '0.5rem',
        fontSize: '2.25rem'
      },
      prices: {
        fontSize: '0.8rem',
        lineHeight: '1.34em',
        display: 'flex',
        flexFlow: 'row nowrap'
      },
      column: {
        margin: '0 .25rem'
      }
    }
  }
}