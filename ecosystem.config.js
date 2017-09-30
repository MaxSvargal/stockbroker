const exchanger = (account, pairs) => ({
  name: `exchanger_${account}_${pairs.join(',')}`,
  script: "./src/exchanger/index.ts",
  watch: true,
  env: {
    "DEBUG": "worker",
    "NODE_PATH": "./src",
    "ACCOUNT": account,
    "PAIRS": pairs.join(',')
  }
})

const slowpoke = (account) => (pair, amount) => ({
  name: `slowpoke_${account}_${pair}`,
  script: "./src/slowpoke/index.ts",
  watch: true,
  env: {
    "DEBUG": "worker",
    "NODE_PATH": "./src",
    "ACCOUNT": account,
    "PAIR": pair,
    "AMOUNT": String(amount)
  }
})

module.exports = {
  apps: [
    exchanger('maxsvargal', [ 'BTCUSD', 'DSHUSD', 'ETHUSD', 'LTCUSD', 'ETCUSD' ]),
    exchanger('lesorub', [ 'ETCUSD' ]),

    slowpoke('maxsvargal')('BTCUSD', 0.005),
    slowpoke('maxsvargal')('DSHUSD', 0.04),
    slowpoke('maxsvargal')('ETHUSD', 0.05),
    slowpoke('maxsvargal')('LTCUSD', 1),
    slowpoke('maxsvargal')('ETCUSD', 1),

    slowpoke('lesorub')('ETCUSD', 1)
  ]
}
