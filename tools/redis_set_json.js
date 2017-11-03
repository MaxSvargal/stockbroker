#!/bin/env node
// Usage: node ./redis_set_json.js #databaseIndex, #tableName, #JSONFilePath

const [ env, script, dbIndex, name, filePath ] = process.argv

const fs = require('fs')
const redis  = require('redis')
const client = redis.createClient({ db: dbIndex || 0 })

const json = fs.readFileSync(filePath)

client.on('error', err => console.error(err))
client.set(name, json.toString(), redis.print)
client.quit()
