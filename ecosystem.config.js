const accounts = require('./accounts.config')

module.exports = {
  apps: [ {
    name: 'worker:me:btc-eth',
    script: './dist/worker_bundle.js',
    watch: true,
    env: {
      NODE_ENV: 'development',
      ACCOUNT_KEY: accounts.maxsvargal.key,
      ACCOUNT_SECRET: accounts.maxsvargal.secret,
      CURRENCY_PAIR: 'BTC_ETH',
      DB_PATH: './server/db/me_btc_eth',
      PORT: 8070
    },
    env_production: {
      NODE_ENV: 'production',
      ACCOUNT_KEY: accounts.maxsvargal.key,
      ACCOUNT_SECRET: accounts.maxsvargal.secret,
      CURRENCY_PAIR: 'BTC_ETH',
      DB_PATH: './server/db/me_btc_eth',
      PORT: 8070
    }
  }, {
    name: 'frontend',
    script: './dist/frontend_bundle.js'
  } ]
}
