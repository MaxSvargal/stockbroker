import Poloniex from 'services/poloniex'

export default function* poloniexPrivateSaga() {
  const poloniex = new Poloniex({
    key: 'I94AGT6H-HEUAIL5B-G34YF99I-IYR0777F',
    secret: '758c86f9c922e164f573801663f641acb625e4118f646f0b5612da38cd18a171716d580af12104c3719b935b2cf1510f6df3359e28f403e9bf32e2cbe2faa97f'
  })

  poloniex.privateRequest({ command: 'returnOrderTrades', orderNumber: 0 })
    .then(data => console.log(data))
}
