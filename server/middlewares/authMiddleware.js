const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-password');

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = protect;
