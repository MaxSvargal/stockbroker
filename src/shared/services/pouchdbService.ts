const PouchDB = require('pouchdb')

export default (dbName: string) =>
  new PouchDB(`http://127.0.0.1:5984/${dbName}`, {
    ajax: {
      cache: true,
      timeout: 120000,
    },
    auth: {
      username: 'worker',
      password: 'hUY7t9H7tfdF5d7oI93gVfgd',
    }
  })
