import 'react-hot-loader/patch'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { HashRouter as Router } from 'react-router-dom'
import { h } from 'react-hyperscript-helpers'
import configureStore from 'store/configureStore'
import rootSaga from 'sagas'
import App from 'components/App'

const store = configureStore()

const render = Component =>
  ReactDOM.render(
    h(Router, [
      h(AppContainer, [
        h(Provider, { store }, [ Component() ])
      ])
    ]),
    document.getElementById('root'))

render(App)
store.runSaga(rootSaga)

if (module.hot) module.hot.accept('components/App', () => render(App))
