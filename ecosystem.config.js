const accounts = require('./accounts.config')

const createWorker = ({ name, pair, account, port }) => ({
  name: `${name}:${pair}`,
  script: './dist/worker_bundle.js',
  watch: './dist/worker_bundle.js',
  source_map_support: true,
  max_memory_restart: '250M',
  env: {
    NODE_ENV: 'development',
    ACCOUNT_NAME: name,
    ACCOUNT_KEY: account.key,
    ACCOUNT_SECRET: account.secret,
    CURRENCY_PAIR: pair,
    DB_PATH: `./server/db/${name}_${pair}`,
    PORT: port
  }
})

module.exports = {
  apps: [ {
    name: 'frontend',
    script: './dist/frontend_bundle.js',
    watch: './dist/frontend_bundle.js',
    source_map_support: true,
    max_memory_restart: '150M'
  }, createWorker({
    name: 'maxsvargal',
    pair: 'BTC_ETH',
    account: accounts.maxsvargal,
    port: 8000
  }), createWorker({
    name: 'maxsvargal',
    pair: 'BTC_DASH',
    account: accounts.maxsvargal,
    port: 8001
  }), createWorker({
    name: 'lesorub',
    pair: 'BTC_DASH',
    account: accounts.lesorub,
    port: 8100
  }), createWorker({
    name: 'lesorub',
    pair: 'USDT_DASH',
    account: accounts.lesorub,
    port: 8101
  }), createWorker({
    name: 'lesorub',
    pair: 'BTC_FCT',
    account: accounts.lesorub,
    port: 8102
  }) ]
}
