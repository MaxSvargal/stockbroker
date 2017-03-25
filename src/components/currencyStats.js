import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, h1, div, input } from 'react-hyperscript-helpers'
import { CURRENT_PAIR } from 'const'

const audio = new Audio('Tink.m4a')

class CurrencyStats extends Component {
  constructor(props) {
    super(props)
    this.inputRef = null
    this.state = {
      outputValue: '',
      watchValue: ''
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleWatcherKeyPress = this.handleWatcherKeyPress.bind(this)
  }

  handleKeyPress(e) {
    this.setState({
      outputValue: (e.target.value * this.props.data.last).toFixed(8)
    })
  }

  handleWatcherKeyPress(e) {
    this.setState({
      watchValue: e.target.value
    })
  }

  componentWillReceiveProps(nextProps) {
    const { watchValue } = this.state
    const watchValueNumber = Number(watchValue)

    if (nextProps.data.last >= watchValueNumber && watchValueNumber !== 0) {
      audio && audio.play()
    }

    document && (document.title = nextProps.data.last)
    this.inputRef && this.handleKeyPress({ target: { value: this.inputRef.value } })
  }

  render() {
    const { data } = this.props
    const { outputValue } = this.state
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      h1({ style: styles.h1 }, 'USDT_ETH'),
      data ?
        div([
          div({ style: styles.watcher }, [
            input({
              style: styles.inputWatcher,
              onKeyUp: this.handleWatcherKeyPress,
              ref: (c => (this.watcherRef = c))
            }),
            div('- уведомление при курсе')
          ]),
          div({ style: styles.course }, [
            input({
              style: styles.input,
              onKeyUp: this.handleKeyPress,
              ref: (c => (this.inputRef = c))
            }),
            div({ style: styles.x }, 'x'),
            div({ style: styles.bigger }, data.last),
            outputValue > 0 && div({ style: styles.total }, `= ${outputValue} $`)
          ]),
          div([ 'Спрос: ', data.lowestAsk ]),
          div([ 'Предложение: ', data.highestBid ]),
          div([ 'Высшая цена за 24 часа: ', data.hrHigh ]),
          div([ 'Низшая цена за 24 часа: ', data.hrLow ]),
          div([ 'Сдвиг: ', data.percentChange, '%' ]),
          div([ 'Объём: ', data.baseVolume ])
        ])
      :
        div('Ожидание обновления курса...')
    ])
  }

  getStyles() {
    return {
      root: {
        fontSize: '1.2rem',
        lineHeight: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '2.5rem'
      },
      h1: {
        fontSize: '3rem'
      },
      bigger: {
        fontSize: '3.6rem',
        margin: '2.5rem 0',
        color: '#e352c9'
      },
      course: {
        display: 'flex',
        marginBottom: '1rem'
      },
      input: {
        width: '7rem',
        height: '2.8rem',
        marginTop: '1.75rem',
        background: '#144b44',
        color: '#fff',
        border: 0,
        fontWeight: 'bold',
        fontSize: '1.4rem'
      },
      inputWatcher: {
        border: 0,
        width: '7rem',
        marginRight: '.8rem',
        background: '#144b44',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      },
      watcher: {
        display: 'flex'
      },
      x: {
        display: 'flex',
        width: '2rem',
        height: '3rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1.75rem',
        fontSize: '2rem',
        color: '#24a292'
      },
      total: {
        fontSize: '1.6rem',
        marginTop: '5rem',
        marginLeft: '-16rem',
        color: '#24a292'
      }
    }
  }
}

const mapStateToProps = ({ currencies }) =>
  ({ data: currencies[CURRENT_PAIR] })

export default hh(connect(mapStateToProps)(CurrencyStats))
