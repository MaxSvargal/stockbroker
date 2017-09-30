module.exports = {
  apps : [
    {
      name: "maxsvargal_exchanger",
      script: "./src/exchanger/index.ts",
      watch: true,
      env: {
        "DEBUG": "worker",
        "ACCOUNT": "maxsvargal"
        "PAIRS": "BTCUSD"
        "NODE_PATH": "./src"
      }
    },
    {
      name: "maxsvargal_slowpoke_btcusd",
      script: "./src/slowpoke/index.ts",
      watch: true,
      env: {
        "DEBUG": "worker",
        "ACCOUNT": "maxsvargal"
        "PAIR": "BTCUSD"
        "NODE_PATH": "./src"
      }
    }
  ]
}
