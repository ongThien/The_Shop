//req: to access the session created by the express-session
//user: to access user data
//action: execute after the session is updated in the store

const createUserSession = (req, user, action) => {
  req.session.uid = user._id.toString();
  req.session.save(action);
};

const destroyUserAuthSession = (req) => {
  req.session.uid = null;
  // req.session.save();
  //don't need to call save() here as there are no actions rely on the result of this operation
};

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession
}