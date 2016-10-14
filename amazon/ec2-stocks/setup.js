'use strict'

const AWS = require('aws-sdk')
let dynamo = null
let documents = null

function getConfig() {
  return {
    endpoint: 'http://localhost:8000',
    region: 'localhost'
  }
}

function createDynamoClient() {
  console.log("Creating DynamoDB Client...")
  let options = getConfig()
  let dynamo = new AWS.DynamoDB(options)
  return dynamo
}

function createDocumentsClient() {
  console.log("Creating Documents Client...")
  let options = getConfig()
  let documents = new AWS.DynamoDB.DocumentClient(options)
  return documents
}

function createTables(callback) {
  let params = {
    TableName: "StockPrices",
    KeySchema: [
      { AttributeName: "Date", KeyType: "HASH" },  //Partition key
      { AttributeName: "Stock", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "Date", AttributeType: "S" },
      { AttributeName: "Stock", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  };
  dynamo.createTable(params, (err, data) => {
    if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      return callback(err)
    } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      return callback(null, data)
    }
  });
}

function listTables(callback) {
  let params = {}
  dynamo.listTables(params, (err, data) => {
    if (err) {
      console.log("Failed listing tables: " + err.message)
      return callback(err)
    }
    else {
      console.log("Current tables: " + JSON.stringify(data, null, 2))
      return callback(null, data)
    }
  })
}

function addSampleItem(callback) {
  let params = {
    TableName: "StockPrices",
    Item: {
      "Stock": "ADBE",
      "Open": 107.65,
      "Date": "2016-10-13"
    }
  }
  documents.put(params, (err, data) => {
    if (err) {
      console.log("Failed adding sample item: " + err.message)
      return callback(err)
    }
    else {
      console.log("Success adding sample item: " + JSON.stringify(data, null, 2))
      return callback(null, data)
    }
  })
}

function addSampleData(callback) {
  let stocks = {
    "ADBE": { "open": 107.65, "close": 108.05, "high": 108.60, "low": 106.20 },
    "AMD" : { "open":   6.64, "close":   6.62, "high":   6.77, "low":   6.42 },
    "AAPL": { "open": 117.36, "close": 117.34, "high": 117.98, "low": 116.75 },
    "GOOG": { "open": 809.30, "close": 810.40, "high": 814.50, "low": 808.55 },
  }
  let items = Object.keys(stocks).map(s => ({
    Stock: s,
    Date: "2016-10-13",
    Open: stocks[s].open,
    Close: stocks[s].close,
    High: stocks[s].high,
    Low: stocks[s].low,
  }))
  let params = {
    RequestItems: {
      "StockPrices": items.map(i => ({ PutRequest: { Item: i } }))
    }
  }
  console.log("Items: ", items)
  console.log("Params: ", JSON.stringify(params, null, 2))
  documents.batchWrite(params, (err, data) => {
    if (err) {
      console.log("Failed adding sample data: " + err.message)
      return callback(err)
    }
    else {
      console.log("Success adding sample data: " + JSON.stringify(data, null, 2))
      return callback(null, data)
    }
  })
}

let queryTable = function(callback) {
  queryByPrimaryKey((err, data) => {
    if (err) return callback(err)
    queryByPartitionKey((err, data) => {
      if (err) return callback(err)
      return callback(null, data)
    })
  })
}

let queryByPrimaryKey = function(callback) {
  let params = {
    TableName: "StockPrices",
    Key: {
      "Stock": "AAPL",
      "Date": "2016-10-13"
    }
  }
  documents.get(params, (err, data) => {
    if (err) {
      console.error("Failed reading document: ", err.message)
      return callback(err)
    }
    else {
      console.log("Read Document: ", data)
      return callback(null, data)
    }
  })
}

let queryByPartitionKey = function(callback) {
  let params = {
    TableName: "StockPrices",
    KeyConditionExpression: "#D = :date",
    ExpressionAttributeNames: {
      "#D": "Date"
    },
    ExpressionAttributeValues: {
      ":date": "2016-10-13"
    }
  }
  documents.query(params, (err, data) => {
    if (err) {
      console.error("Failed querying documents: ", err.message)
      return callback(err)
    }
    else {
      console.log("Found documents: ", data)
      return callback(null, data)
    }
  })
}

let setup = function(callback) {
  createTables((err, data) => {
    if (err) return callback(err)
    listTables((err, data) => {
      if (err)
        return callback(err)
      else
        return callback(null, data)
    })
  })
}

let teardown = function(callback) {
  console.log("Deleting Tables...")
  let params = { TableName: "StockPrices" }
  dynamo.deleteTable(params, callback)
}

let main = function() {
  dynamo = createDynamoClient()
  documents = createDocumentsClient()
  setup((err, data) => {
    addSampleData((err, data) => {
      queryTable((err, data) => {
        teardown((err, data) => {
          console.log("Finished!")
        })
      })
    })
  })
}

main()
