import { Main, combineCycles } from 'redux-cycles'
import { noPositionsToCover } from 'shared/actions'

function clearSearchResults(sources: any) {
  const clear$ = sources.action
    .filter((action: any) => action.type === 'SET_ACCOUNT')
    .map(noPositionsToCover);

  return {
    action: clear$
  }
}

export default combineCycles([ clearSearchResults ])
