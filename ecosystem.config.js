const accounts = require('./accounts.config')

const createWorker = ({ name, pair, account, port, env }) => ({
  name,
  script: './dist/worker_bundle.js',
  watch: './dist/worker_bundle.js',
  source_map_support: true,
  max_memory_restart: '250M',
  env: {
    UV_THREADPOOL_SIZE: 128,
    NODE_ENV: env || 'production',
    CURRENCY_PAIR: pair,
    ACCOUNT_KEY: account.key,
    ACCOUNT_SECRET: account.secret,
    DB_NAME: name,
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
    name: 'maxsvargal_development_worker',
    env: 'development',
    pair: 'BTC_ETH',
    account: accounts.maxsvargal,
    port: 7999
  }), createWorker({
    name: 'maxsvargal_btc_eth',
    pair: 'BTC_ETH',
    account: accounts.maxsvargal,
    port: 8000
  }), createWorker({
    name: 'maxsvargal_btc_dash',
    pair: 'BTC_DASH',
    account: accounts.maxsvargal,
    port: 8001
  }), createWorker({
    name: 'lesorub_btc_dash',
    pair: 'BTC_DASH',
    account: accounts.lesorub,
    port: 8002
  }), createWorker({
    name: 'lesorub_btc_fct',
    pair: 'BTC_FCT',
    account: accounts.lesorub,
    port: 8003
  }), createWorker({
    name: 'lesorub_btc_ltc',
    pair: 'BTC_LTC',
    account: accounts.lesorub,
    port: 8004
  }), createWorker({
    name: 'lesorub_usdt_dash',
    pair: 'USDT_DASH',
    account: accounts.lesorub,
    port: 8005
  }) ]
}
