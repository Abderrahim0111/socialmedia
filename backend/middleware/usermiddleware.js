const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT, (err) => {
      if (err) {
        res.json({ redirect: "Not logged in" });
      } else {
        next();
      }
    });
  } else {
    res.json({ redirect: "Not logged in" });
  }
};


module.exports = {
    requireAuth,
}