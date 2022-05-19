//Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
//the mongoDbStore is responsible for session data
//read more here: https://www.npmjs.com/package/express-session
const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

const createSessionStore = () => {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'the-shop',
    collection: 'sessions'
  });

  return store;
}

const createSessionConfig = () => {
  return {
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000 //2 days (in milliseconds) - if not set, session dies after window is closed, which is also fine
    }
  };
}

module.exports = createSessionConfig;