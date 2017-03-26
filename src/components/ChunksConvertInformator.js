import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div, button, span } from 'react-hyperscript-helpers'
import { convertCurrencyToChunks } from 'actions'

class ChunksConvertInformator extends Component {
  constructor(props) {
    super(props)
    this.state = { show: false }
    this.handleBtnClick = this.handleBtnClick.bind(this)
  }

  handleBtnClick() {
    this.props.convertCurrencyToChunks()
    this.setState({ show: false })
  }

  componentWillReceiveProps({ currentPair, freeCurrencyIsset, currencies }) {
    (freeCurrencyIsset[0] > 0 || freeCurrencyIsset[1] > 0) && currencies[currentPair] &&
      this.setState({ show: true })
  }

  render() {
    const { currentPair, freeCurrencyIsset } = this.props
    const styles = this.getStyles()
    const pairs = currentPair.split('_')

    return this.state.show && (freeCurrencyIsset[0] > 0 || freeCurrencyIsset[1] > 0) && div([
      div({ style: styles.box }, [
        div({ style: styles.row }, [
          div([
            span({ style: styles.title }, 'Обнаружена свободная валюта'),
            freeCurrencyIsset[0] > 0 && span(` ${pairs[0]}: ${freeCurrencyIsset[0]} `),
            freeCurrencyIsset[1] > 0 && span(` ${pairs[1]}: ${freeCurrencyIsset[1]} `)
          ]),
          button({ style: styles.btn, onClick: this.handleBtnClick }, 'Разбить на части и использовать в обороте')
        ])
      ])
    ])
  }

  getStyles() {
    return {
      box: {
        width: '100vw',
        background: '#3b4048',
        color: '#fff',
        fontWeight: 'bold',
        padding: '.75rem 1rem'
      },
      row: {
        display: 'flex',
        justifyContent: 'center'
      },
      btn: {
        marginLeft: '2rem',
        background: '#fff',
        color: '#3b4048',
        border: 0,
        padding: '.25rem 1rem'
      },
      title: {
        lineHeight: '1.8rem'
      }
    }
  }
}

const mapStateToProps = ({ currentPair, freeCurrencyIsset, currencies }) =>
  ({ currentPair, freeCurrencyIsset, currencies })
export default hh(connect(mapStateToProps, { convertCurrencyToChunks })(ChunksConvertInformator))
