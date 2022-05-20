const checkAuthStatus = (req, res, next) => {
  const uid = req.session.uid; //from '/util/authentication'

  if (!uid) {
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;
  next();
};

module.exports = checkAuthStatus;