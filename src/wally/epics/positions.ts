import { compose, map, curry, filter } from 'ramda'
import { select, withState } from 'redux-most'
import { noPositionsToCover, execNewOrder } from 'shared/actions'

// export default compose(
//   select('SET_ACCOUNT'),
//   filter(({ payload }) => payload),
//   map(execNewOrder)
// )

export default compose(
  map(noPositionsToCover),
  select('SET_ACCOUNT')
)
