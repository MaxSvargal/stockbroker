import React, { Component } from 'react'
import { Div, Small, Strong } from 'glamorous'
import { o, filter, propEq, both, pathSatisfies, converge, always, path, length } from 'ramda'
import moment from 'moment'

import BalanceStats from './balanceStats'
import ProfitLine from './profitLine'
import ProfitWaterfall from './profitWaterfall'
import Toggler from './toggler'
import PeriodSelector from './periodSelector'

const getOpenedLength = o(length, filter(propEq('closed', false)))
const timeInPeriod = period => time => time && !moment().isAfter(moment(time), period)
const openTimeInPeriod = converge(pathSatisfies, [ timeInPeriod, always([ 'close', 'time' ]) ])
const filterCandlesByPeriod = period => filter(both(propEq('closed', true), openTimeInPeriod(period)))

export default class extends Component {
  state = {
    positions: this.props.positions
  }

  onSelectPeriod = period =>
    this.setState({ positions: filterCandlesByPeriod(period)(this.props.positions) })

  render() {
    const { profile } = this.props
    const { positions } = this.state
    const openedNowLen = getOpenedLength(this.props.positions)

    return (
      <Div display='flex' flexFlow='row wrap' justifyContent='space-between'>
        <Div flex='1.5 1' minWidth='360'>
          <PeriodSelector onSelect={ this.onSelectPeriod } />
          <BalanceStats
            positions={ positions }
            chunksNumber={ path([ 'preferences', 'chunksNumber' ], profile) }
            openedNowLen={ openedNowLen } />
        </Div>
        <Div flex='1 1' minWidth='300' maxWidth='100%'>
          <Toggler>
            <ProfitWaterfall positions={ positions } />
            <ProfitLine positions={ positions } />
          </Toggler>
        </Div>
      </Div>
    )
  }
}