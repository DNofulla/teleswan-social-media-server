const isAuth = (req, res, next) => {
  // Check for session here
  if (!req.session) {
    res.status(401).send({ message: "Unauthorized request!" });
  }
  return next();
};

module.exports = isAuth;
