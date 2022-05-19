const path = require('path');

const express = require('express');
const csrf = require('csurf');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//parsing incoming forms => gain access to req.body
app.use(express.urlencoded({ extended: true }));

//all incoming requests which are NOT GET requests now need to have a csrf token attached
//requests which are NOT GET requests that don't have a valid csrf token will be denied
app.use(csrf());

app.use(authRoutes);


db.connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log('listening on port 3000');
    });
  })
  .catch((err) => {
    console.log('Failed to connect to database');
    console.log(err);
  });
