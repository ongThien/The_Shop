const { MongoClient } = require('mongodb');

let database;

const connectToDatabase = async () => {
  //establish & connect to local MongoDB server
  const client = await MongoClient.connect('mongodb://localhost:27017');

  //connect to a specific database
  database = client.db('the-shop');
};

const getDb = () => {
  if (!database) {
    throw new Error('Unable to connect to database!');
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
};
