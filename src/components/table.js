import { Component } from 'react'
import { hh, table, tbody, tr, th, td } from 'react-hyperscript-helpers'

class Table extends Component {
  render() {
    const { data } = this.props
    // лимит - последние 60 секунд, минимум 20 шт
    return table([
      tbody([
        tr([
          td('Price'), td('ETH'), td('USDT'), td('Sum(USDT)')
        ]),
        data.map((j, i) => tr({ key: i }, [
          td(j[0]), td(j[1]), /* td(Number(i[0]) * Number(i[1])) /*, td(new Date(i[2]).toString()) */
        ]))
      ])
    ])
  }
}

export default hh(Table)
