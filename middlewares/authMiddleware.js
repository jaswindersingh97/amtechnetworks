const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user;  // Store user info in request for further use
    next();  // Proceed to the next middleware or route
  });
};

module.exports = authenticateToken;
