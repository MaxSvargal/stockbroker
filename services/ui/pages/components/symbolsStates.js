import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import {
  propEq, cond, T, always, equals, sortBy, props, o, join, reverse, compose,
  converge, pair, nth, match, concat
} from 'ramda'

const symbolBaseURI = 'https://www.binance.com/tradeDetail.html?symbol='
const takePairFromSymbol = compose(converge(pair, [ nth(1), nth(2) ]), match(/(.+)(...)/))
const makeExchangeSymbolURI = compose(concat(symbolBaseURI), join('_'), takePairFromSymbol)

const getSymbolStateType = cond([
  [ propEq('15m', true), always('enabled') ],
  [ propEq('1h', true), always('prepared') ],
  [ T, always('growing') ]
])

const getSymbolStateTitle = cond([
  [ propEq('15m', true), always('is ready to buy') ],
  [ propEq('1h', true), always('is started grow') ],
  [ T, always('is grow globally') ]
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

const ListContainer = glamorous.div({
  display: 'flex',
  flexFlow: 'row wrap',
  maxHeight: '70vh',
  overflowY: 'auto'
})

export default class extends Component {
  render () {
    const { data } = this.props
    const sorted = o(reverse, sortBy(props([ '15m', '1h' ])), data)

    return <Div alignSelf='flex-end' >
      <ListContainer>
        { sorted.map(v => (
          <SymbolBlock
            key={v.symbol}
            type={getSymbolStateType(v)}
            href={makeExchangeSymbolURI(v.symbol)}
            title={`${v.symbol} ${getSymbolStateTitle(v)}`}
            target='_blank'
            >{ v.symbol }
          </SymbolBlock>
        )) }
      </ListContainer>
    </Div>
  }
}