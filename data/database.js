const { MongoClient } = require('mongodb');

//establish local MongoDB server
const client = new MongoClient('mongodb://localhost:27017');

const connectToDatabase = async () => {
  //connect to local MongoDB server
  await client.connect();

  //connect to a specific database
  const database = client.db('the-shop');

  if (!database) {
    throw new Error ('Unable to connect to database!');
  }

  return database;
}

module.exports = connectToDatabase;