const jwt = require('jsonwebtoken');

const createToken = (res,userId) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}