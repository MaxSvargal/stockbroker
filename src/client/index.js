import 'react-hot-loader/patch'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import { h } from 'react-hyperscript-helpers'
import store from './store'
import App from './components/App'

const render = Component =>
  ReactDOM.render(
    h(Router, [
      h(AppContainer, [
        h(Provider, { store }, [ Component() ])
      ])
    ]),
    document.getElementById('root'))

render(App)

if (module.hot) module.hot.accept('./components/App', () => render(App))
