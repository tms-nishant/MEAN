const MongoClient = require("mongodb").MongoClient;
const dbURL = "mongodb://127.0.0.1:27017";
const dbName = "students";
let _db;

// Initializing DB which will be called prior to starting app server
const initDB = (callback) => {
  if (_db) {
    console.log("DB already up and running");
    return callback(null, _db);
  }

  MongoClient.connect(dbURL)
    .then((client) => {
      _db = client.db(dbName);
      callback(null, _db);
    })
    .catch((error) => {
      callback("error while connecting with DB", null);
    });
};

// will return DB client for already established connection
const getDB = () => {
  if (!_db) {
    throw new Error("DB not initialized");
  }
  return _db;
};

// exporting functions to make them available globally
module.exports = {
  initDB,
  getDB,
};
