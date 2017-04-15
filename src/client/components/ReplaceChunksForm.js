import { Component, PropTypes } from 'react'
import { hh, div, button, h2 } from 'react-hyperscript-helpers'

import InputNumber from './InputNumber'

class ReplaceChunksForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: 0.01,
      to: 0.1
    }
  }

  onClick() {
    const { from, to } = this.state
    this.props.onChange({ from, to })
  }

  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.col }, [
        h2({ style: styles.header }, 'Замена объёмов чанок'),
        button({
          style: styles.actionBtn,
          onClick: () => this.onClick()
        }, 'Заменить объёмы ставок')
      ]),
      div({ style: styles.col }, [
        InputNumber({
          label: 'с',
          defaultValue: this.state.from,
          onChange: from => this.setState({ from })
        }),
        InputNumber({
          label: 'на',
          defaultValue: this.state.to,
          onChange: to => this.setState({ to })
        })
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '3rem'
      },
      header: {
        margin: '2rem 1rem 0 1rem'
      },
      col: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      actionBtn: {
        margin: '2rem 1rem 0 0',
        padding: '0 1rem',
        background: '#ae81ff',
        color: '#fff',
        border: 0,
        fontSize: '0.8rem'
      }
    }
  }
}

ReplaceChunksForm.propTypes = {
  onChange: PropTypes.func
}

export default hh(ReplaceChunksForm)
