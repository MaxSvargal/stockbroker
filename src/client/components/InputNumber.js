import { Component } from 'react'
import debounce from 'debounce'
import { hh, div, input, label } from 'react-hyperscript-helpers'

class InputNumber extends Component {
  constructor(props) {
    super(props)
    this.onChange = debounce(props.onChange, 500)
  }

  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      label({ style: styles.label }, this.props.label),
      input({
        type: 'number',
        style: styles.input,
        defaultValue: this.props.defaultValue,
        onChange: e => this.onChange(Number(e.target.value))
      }),
      this.props.children && this.props.children
    ])
  }

  getStyles() {
    return {
      root: {
        margin: '1rem',
        flexGrow: 1,
        position: 'relative'
      },
      label: {
        display: 'block',
        margin: '0.5rem 0',
        fontSize: '1.1rem'
      },
      input: {
        fontSize: '1.2rem',
        padding: '.5rem 1rem',
        width: '100%',
        boxSizing: 'border-box'
      }
    }
  }
}

export default hh(InputNumber)
