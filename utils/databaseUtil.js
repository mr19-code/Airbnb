const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const MONGO_URL = "mongodb+srv://meet18:root@meet18.5u3yubv.mongodb.net/airbnb?retryWrites=true&w=majority";
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then(client => {
      _db = client.db("airbnb");
      callback(client);
    }).catch(err => {
      console.log("Error connecting to MongoDB:", err);
    });
}

const getDb = () => {
  if (!_db) {
    throw new Error("Database not initialized. Call mongoConnect first.");
  }
  return _db;
};
module.exports = { mongoConnect, getDb };


