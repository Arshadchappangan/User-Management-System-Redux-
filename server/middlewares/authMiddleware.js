const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req,res,next) => {
    let token = res.cookie.jwt;
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decode.userId).select('-password');
        next();
    } catch (error) {
        res.status(401).send('Not authorized, Token not valid')
    }
}

module.exports = protect