const jwt = require("jsonwebtoken");

function jwtVerify(req, res, next) {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token is not valid" });
  }
}

module.exports = jwtVerify;
