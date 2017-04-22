import { Component } from 'react'
import { h, hh, div } from 'react-hyperscript-helpers'
import { Responsive, WidthProvider } from 'react-grid-layout'

// import BigTable from './BigTable'
import BotLog from './BotLog'
import TradeTable from './TradeTable'
import CurrencyStats from './CurrencyStats'
import CurrencyRate from './CurrencyRate'
import BalancePieChart from './BalancePieChart'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

class FullModePage extends Component {
  render() {
    const layouts = {
      lg: [
        { i: 'rate', x: 0, y: 0, w: 5, h: 1 },
        { i: 'stats', x: 7, y: 0, w: 3, h: 1 },
        { i: 'balance', x: 5, y: 0, w: 2, h: 1 },
        { i: 'trade', x: 10, y: 0, w: 5, h: 4, minW: 3, maxW: 12 },
        { i: 'log', x: 0, y: 2, w: 7, h: 4, minW: 3, maxW: 12 }
      ],
      md: [
        { i: 'rate', x: 0, y: 0, w: 3, h: 1 },
        { i: 'balance', x: 3, y: 0, w: 2, h: 1 },
        { i: 'stats', x: 7, y: 0, w: 3, h: 1 },
        { i: 'trade', x: 6, y: 2, w: 4, h: 4, minW: 3, maxW: 12 },
        { i: 'log', x: 0, y: 2, w: 6, h: 4, minW: 3, maxW: 12 }
      ],
      sm: [
        { i: 'rate', x: 0, y: 0, w: 2, h: 1 },
        { i: 'balance', x: 2, y: 0, w: 2, h: 1 },
        { i: 'stats', x: 4, y: 0, w: 2, h: 1 },
        { i: 'trade', x: 3, y: 2, w: 3, h: 3, minW: 3, maxW: 12 },
        { i: 'log', x: 0, y: 2, w: 3, h: 3, minW: 3, maxW: 12 }
      ],
      xs: [
        { i: 'rate', x: 0, y: 0, w: 4, h: 1 },
        { i: 'log', x: 0, y: 1, w: 4, h: 2 },
        { i: 'trade', x: 0, y: 3, w: 4, h: 2 },
        { i: 'balance', x: 0, y: 5, w: 4, h: 1 },
        { i: 'stats', x: 0, y: 6, w: 4, h: 1 }
      ]
    }

    return h(ResponsiveReactGridLayout, {
      layouts,
      rowHeight: 160,
      margin: [ 20, 20 ],
      containerPadding: [ 20, 20 ],
      breakpoints: { lg: 1366, md: 996, sm: 768, xs: 320, xxs: 0 },
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    }, [
      div({ key: 'rate' }, [ CurrencyRate() ]),
      div({ key: 'stats' }, [ CurrencyStats() ]),
      div({ key: 'balance' }, [ BalancePieChart() ]),
      div({ key: 'log' }, [ BotLog() ]),
      div({ key: 'trade' }, [ TradeTable() ]),
    ])
  }
}

export default hh(FullModePage)
