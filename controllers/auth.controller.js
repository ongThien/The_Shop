const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');

const getSignup = (req, res) => {
  res.render('customer/auth/signup');
};

const signup = async (req, res, next) => {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) || !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    return res.redirect('/signup');
  }

  //Express ignores errors occur inside asynchronous operations
  //if something goes wrong in asynchronous operations, the express error handler middleware will not be activated
  //therefore you have to handle it manually in the try - catch block, forward the error (if any - after catching by the next function)
  try {
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

  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    res.redirect('/login');
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
