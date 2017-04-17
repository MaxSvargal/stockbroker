import { combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb'
import { reducers } from '../../shared/reducers'

const persistentReducers = Object.keys(reducers).reduce((obj, key) =>
  Object.assign({}, obj, { [key]: persistentReducer(reducers[key], key) }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
