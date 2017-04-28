import { createReducer } from 'redux-act'
import { addMessage } from '../actions'
import { now } from './helpers'

/*
 * <object> Message
 * @type service
 * @type analytic
 * @type chunks
 * @type transaction
 * @type failure
 * @type error
*/
export const messages = createReducer({
  [addMessage]: (state, { type, message }) =>
    [ ...state, { created: now(), type, message } ]
}, [ { created: now(), type: 'service', message: 'Initiated' } ])

export default messages
