const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const csrf = require('csurf');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCSRFTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/products/assets', express.static(path.join(__dirname, 'product-data')));

//parsing incoming forms => gain access to req.body
app.use(express.urlencoded({ extended: true }));

//initialize session middleware
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//Generate the tokens + checks incoming tokens for validity
//read more here: https://github.com/expressjs/csurf
app.use(csrf());
//distribute generated tokens to all other middlewares / route handles functions & views
app.use(addCSRFTokenMiddleware);
//all incoming requests which are NOT GET requests now need to have a csrf token attached
//requests which are NOT GET requests that don't have a valid csrf token will be denied
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandlerMiddleware);

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
