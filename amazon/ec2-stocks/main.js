'use strict'

var AWS = require('aws-sdk')
var dynamo = null

function createDynamoClient() {
  console.log("Creating DynamoDB client...")
  var options = {
    endpoint: 'http://localhost:8000'
  , region: 'localhost'
  }
  var dynamo = new AWS.DynamoDB(options)
  return dynamo
}

function listTables(callback) {
  var params = {}
  dynamo.listTables(params, (err, data) => {
    if (err) {
      console.log("Failed listing tables: " + err.message)
      return callback(err)
    }
    else {
      console.log("Current tables: " + JSON.stringify(data, null, '  '))
      return callback(null, data)
    }
  })
}

let main = function() {
  dynamo = createDynamoClient()
  listTables((err, data) => {
    console.log("Finished!")
  })
}

main()
