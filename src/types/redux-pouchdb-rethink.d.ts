declare module 'redux-pouchdb-rethink' {
  export function persistentStore(options: { db: PouchDB, onReady?: (reducer: any, state: any) => void }): Redux.Store
  export function persistentReducer(reducer: function, options: { name: string }): function
}
