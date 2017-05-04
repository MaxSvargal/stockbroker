import { Component } from 'react'
import debounce from 'debounce'
import { hh, div, button } from 'react-hyperscript-helpers'

class FloatButton extends Component {
  constructor(props) {
    super(props)
    this.onChange = debounce(props.onChange, 500)
  }

  render() {
    const { label, onClick } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      button({ style: styles.btn, onClick: e => e.persist() || onClick() }, label)
    ])
  }

  getStyles() {
    return {
      root: {
        position: 'absolute',
        right: '.3rem',
        bottom: '.3rem'
      },
      btn: {
        display: 'block',
        fontSize: '0.8rem',
        padding: '0.5rem 1rem',
        height: '2.05rem',
        border: 0,
        margin: 0,
        background: '#d8544c',
        color: '#fff'
      }
    }
  }
}

export default hh(FloatButton)
