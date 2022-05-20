const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

const getSignup = (req, res) => {
  res.render('customer/auth/signup');
};

const signup = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postalCode: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      enteredData.email,
      enteredData.password,
      enteredData.fullname,
      enteredData.street,
      enteredData.postal,
      enteredData.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'Invalid user credentials - Please check your input',
        ...enteredData,
      },
      () => {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(
    enteredData.email,
    enteredData.password,
    enteredData.fullname,
    enteredData.street,
    enteredData.postal,
    enteredData.city
  );

  //Express ignores errors occur inside asynchronous operations
  //if something goes wrong in asynchronous operations, the express error handler middleware will not be activated
  //therefore you have to handle it manually in the try - catch block, forward the error (if any - after catching by the next function)
  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User already exists! Try logging in instead',
          ...enteredData,
        },
        () => {
          res.redirect('/signup');
        }
      );
      return;
    }

    await user.signup();
  } catch (err) {
    return next(err);
  }

  res.redirect('/login');
};

const getLogin = (req, res) => {
  res.render('customer/auth/login');
};

const login = async (req, res, next) => {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (err) {
    return next(err);
  }

  const sessionErrorData = {
    errorMessage: 'Invalid credentials - please check your input!',
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect('/login');
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect('/login');
    });
    return;
  }
  //utilizing user session & authentication to set res.locals conditionally for EJS
  //see more in '/middlewares/check-auth'
  authUtil.createUserSession(req, existingUser, () => {
    res.redirect('/');
  });
};

const logout = (req, res) => {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
};

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
