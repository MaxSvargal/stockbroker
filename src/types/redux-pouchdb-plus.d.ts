declare module 'redux-pouchdb-plus' {
  export function persistentStore(options: { db: PouchDB }): Redux.Store
  export function persistentReducer(reducer: function, options: { name: string }): function
}
