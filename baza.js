// Retrieve
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://10.255.0.80:27017/dota", function(err, db) {
  if(!err) {
    console.log("We are connected");
    module.exports.db = db;
  }
});
