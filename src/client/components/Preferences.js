import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { hh, div } from 'react-hyperscript-helpers'
import {
  setObsoleteThreshold,
  setChunkAmount,
  requestInvalidateChunks,
  replaceChunksAmount,
  setBuyProfitThreshold,
  setSellProfitThreshold
} from '../../shared/actions'

import InputNumber from './InputNumber'
import FloatButton from './FloatButton'
import ReplaceChunksForm from './ReplaceChunksForm'

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
        div({ style: styles.column }, [
          div({ style: styles.row }, [
            InputNumber({
              label: 'Порог прибыли на покупку',
              defaultValue: this.props.buyProfitThreshold,
              onChange: this.props.setBuyProfitThreshold
            }),
            InputNumber({
              label: 'Порог прибыли на продажу',
              defaultValue: this.props.sellProfitThreshold,
              onChange: this.props.setSellProfitThreshold
            })
          ]),
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
            onChange: this.props.setChunkAmount
          }),
          ReplaceChunksForm({
            onChange: this.props.replaceChunksAmount
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
      column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      },
      row: {
        display: 'flex',
        flexDirection: 'row'
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

const mapStateToProps = ({
  buyProfitThreshold,
  sellProfitThreshold,
  obsoleteThreshold,
  autocreatedChunkAmount
}) => ({
  buyProfitThreshold,
  sellProfitThreshold,
  obsoleteThreshold,
  autocreatedChunkAmount
})

const dispatchToProps = {
  setObsoleteThreshold,
  setChunkAmount,
  setBuyProfitThreshold,
  setSellProfitThreshold,
  requestInvalidateChunks,
  replaceChunksAmount
}

export default hh(withRouter(connect(mapStateToProps, dispatchToProps)(Preferences)))
