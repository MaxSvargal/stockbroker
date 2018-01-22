import debug from 'debug'

const error = debug('app:error')
const log = debug('app:log')

log.log = console.log.bind(console)

export { log, error }
export default log
