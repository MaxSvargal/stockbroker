module.exports = {
  apps: [
    {
      name: "maxsvargal_exchanger",
      script: "./src/exchanger/index.ts",
      watch: true,
      env: {
        "DEBUG": "worker",
        "NODE_PATH": "./src",
        "ACCOUNT": "maxsvargal",
        "PAIRS": "BTCUSD,ETCUSD"
      }
    },
    {
      name: "maxsvargal_slowpoke_btcusd",
      script: "./src/slowpoke/index.ts",
      watch: true,
      env: {
        "DEBUG": "worker",
        "NODE_PATH": "./src",
        "ACCOUNT": "maxsvargal",
        "PAIR": "BTCUSD",
        "AMOUNT": "0.01"
      }
    },
    {
      name: "maxsvargal_slowpoke_etcusd",
      script: "./src/slowpoke/index.ts",
      watch: true,
      env: {
        "DEBUG": "worker",
        "NODE_PATH": "./src",
        "ACCOUNT": "maxsvargal",
        "PAIR": "ETCUSD",
        "AMOUNT": "1"
      }
    }
  ]
}
