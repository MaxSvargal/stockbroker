import React, { Component } from 'react'
import { Chart } from 'react-google-charts'

export default class extends Component {
  render () {
    return <div style={{ position: 'relative', overflow: 'hidden', height: '8rem', width: '100%' }}>
      { this.props.data && this.props.data.length <= 0 ? <div/> :
        <Chart
          chartType='AreaChart'
          width='100%'
          data={[
            [ 'x', 'close', 'bought' ],
            ...this.props.data
          ]}
          options={{
            annotations: 'none',
            backgroundColor: {
              fill: 'transparent',
              strokeWidth: 0
            },
            chartArea: {
              left: 0,
              top: 0,
              width: '100%',
              height: '8rem'
            },
            colors: [
              this.props.type === 'positive' ? '#d4e157' : '#ec407a',
              this.props.type === 'positive' ? '#2e7d32' : '#8e24aa'
            ],
            enableInteractivity: false,
            hAxis: {
              logScale: true,
              baseline: 0,
              baselineColor: 'transparent',
              gridlines: {
                color: 'transparent'
              },
              textPosition: 'none'
            },
            interpolateNulls: true,
            legend: {
              position: 'none'
            },
            series: {
              0: {
                areaOpacity: 0.1
              },
              1: {
                areaOpacity: 0,
                lineDashStyle: [ 1, 12 ]
              }
            },
            vAxis: {
              logScale: true,
              baseline: 0,
              baselineColor: 'transparent',
              gridlines: {
                color: 'transparent'
              },
              textPosition: 'none'
            },
            width: '2rem'
          }}
        />
      }
    </div>
  }
}
