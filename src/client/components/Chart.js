import { Component } from 'react'
import { h, hh, div } from 'react-hyperscript-helpers'

class Chart extends Component {
  componentDidMount() {
    /* eslint global-require: 0 */
    this.setState({
      pie: require('react-chartjs-2').Pie
    })
  }

  render() {
    const { type, data, options } = this.props
    const component = this.state && this.state[type]
    const defaultOptions = {
      animateScale: true,
      legend: {
        display: false
      }
    }
    return component ?
      h(component, { data, options: options || defaultOptions }) :
      div()
  }
}

export default hh(Chart)
