import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import {
  propEq, cond, T, always, equals, sortBy, props, o, join, reverse, compose,
  converge, pair, nth, match
} from 'ramda'

const takePairFromSymbol = compose(converge(pair, [ nth(1), nth(2) ]), match(/(.+)(...)/))

const getSymbolStateType = cond([
  [ propEq('15m', true), always('enabled') ],
  [ propEq('1h', true), always('prepared') ],
  [ T, always('growing') ]
])

const SymbolBlock = glamorous.a(({ type }) => ({
  background: cond([
    [ equals('enabled'), always('#ffa726') ],
    [ equals('prepared'), always('#81c784') ],
    [ equals('growing'), always('#7986cb') ]
  ])(type),
  textDecoration: 'none',
  padding: '.5rem .25rem',
  borderBottom: '1px solid #fafafa',
  color: '#fff',
  textAlign: 'center',
  fontSize: '.9rem',
  flexGrow: 1
}))

export default class extends Component {
  render () {
    const { data } = this.props
    const sorted = o(reverse, sortBy(props([ '15m', '1h' ])), data)

    return <Div alignSelf='flex-end' >
      <Div display='flex' flexFlow='row wrap' justifyContent='space-between'>
        { sorted.map(v => (
          <SymbolBlock
            type={getSymbolStateType(v)}
            href={`https://www.binance.com/tradeDetail.html?symbol=${o(join('_'), takePairFromSymbol, v.symbol)}`}
            >{ v.symbol }
          </SymbolBlock>
        )) }
      </Div>
    </Div>
  }
}