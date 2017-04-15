import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { hh, div } from 'react-hyperscript-helpers'
import {
  setProfitThreshold,
  setObsoleteThreshold,
  setAutocreatedChunkAmount,
  requestInvalidateChunks
} from 'shared/actions'

import InputNumber from './InputNumber'
import FloatButton from './FloatButton'

class Preferences extends Component {
  constructor(props) {
    super(props)
    this.state = { flashBg: false }
  }

  flashBackground() {
    this.setState({ flashBg: true })
    setTimeout(() => this.setState({ flashBg: false }), 200)
  }

  shouldComponentUpdate(props) {
    return props.profitThreshold !== this.props.profitThreshold ||
      props.obsoleteThreshold !== this.obsoleteThreshold ||
      props.autocreatedChunkAmount !== this.autocreatedChunkAmount
  }

  render() {
    const styles = this.getStyles()

    return div({ style: styles.root(this.state.flashBg) }, [
      div({ style: styles.box }, [
        div({ style: styles.row }, [
          InputNumber({
            label: 'Порог прибыли',
            defaultValue: this.props.profitThreshold,
            onChange: this.props.setProfitThreshold
          }),
          InputNumber({
            label: 'Порог удаления устаревших чанков',
            defaultValue: this.props.obsoleteThreshold,
            onChange: this.props.setObsoleteThreshold
          }, [
            FloatButton({
              label: 'Очистить сейчас',
              onClick: this.props.requestInvalidateChunks
            })
          ]),
          InputNumber({
            label: 'Объём чанка автоматического создания',
            defaultValue: this.props.autocreatedChunkAmount,
            onChange: this.props.setAutocreatedChunkAmount
          })
        ])
      ])
    ])
  }

  getStyles() {
    return {
      root: animateState => ({
        width: '100vw',
        height: '94vh',
        background: animateState ? '#30db7d' : '#282c34',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: animateState ? 'background 0.05s' : 'background 1s ease-out'
      }),
      box: {
        maxWidth: '95vw',
        minWidth: '50vw',
        minHeight: '75vh'
      },
      loading: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      row: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      },
      col: {
        margin: '.5rem'
      },
      removeBtn: {
        background: '#de6a70',
        color: '#fff',
        border: 0,
        fontSize: '.9rem',
        padding: '.65rem 1rem',
        margin: '2rem .2rem 0 .2rem'
      }
    }
  }
}

Preferences.propTypes = {
  profitThreshold: PropTypes.number,
  obsoleteThreshold: PropTypes.number,
  autocreatedChunkAmount: PropTypes.number
}

const mapStateToProps = ({
  profitThreshold,
  obsoleteThreshold,
  autocreatedChunkAmount
}) => ({
  profitThreshold,
  obsoleteThreshold,
  autocreatedChunkAmount
})

const dispatchToProps = {
  setProfitThreshold,
  setObsoleteThreshold,
  setAutocreatedChunkAmount,
  requestInvalidateChunks
}

export default hh(withRouter(connect(mapStateToProps, dispatchToProps)(Preferences)))
