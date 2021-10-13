const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    req.session.error = "You have to Login first!";
    return res.status(401).send({ error: "You are not authenticated!" });
  }
};

module.exports = isAuth;
