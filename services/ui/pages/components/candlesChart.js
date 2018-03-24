import React from 'react'
import { Chart } from 'react-google-charts'

export default ({ data, type, width, height }) =>
  data && data.length <= 0
    ? <div />
    : <Chart
      chartType='AreaChart'
      width={ width }
      height={ height }
      data={[
        [ 'x', 'close', 'bought' ],
        ...data
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
          type === 'positive' ? '#d4e157' : '#ec407a',
          type === 'positive' ? '#2e7d32' : '#8e24aa'
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
