const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const csrf = require('csurf');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCSRFTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/products/assets', express.static(path.join(__dirname, 'product-data')));

//parsing incoming forms => gain access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//initialize session middleware
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//Generate the tokens + checks incoming tokens for validity
//read more here: https://github.com/expressjs/csurf
app.use(csrf());
//initialize cart
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);
//distribute generated tokens to all other middlewares / route handles functions & views
app.use(addCSRFTokenMiddleware);
//all incoming requests which are NOT GET requests now need to have a csrf token attached
//requests which are NOT GET requests that don't have a valid csrf token will be denied
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutesMiddleware, ordersRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

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
