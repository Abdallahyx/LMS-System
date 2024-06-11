const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = 'af53e07f90f1923b9b1e2073b0a6f5c15c1e18c76e795a4a8caac1d1e0b237c7';

const authMiddleware = async (req, res, next) => {
  let token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  token = token.split(' ')[1]; // Extract just the token part without 'Bearer '

  try {
    const decoded = jwt.verify(token, secretKey); // Use the same secret key used while generating the token
    req.user = await User.findById(decoded.userId); // Assuming userId is stored in the token
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
