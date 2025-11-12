const jwt = require('jsonwebtoken');

const createToken = (res,userId) => {

    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})

    res.cookie('jwt',token,{
        httpOnly : true,
        secure : process.env.NODE_ENV !== 'development',
        sameSite : 'strict',
        maxAge : 24 * 60 * 1000
    })
    return token
}

module.exports = createToken;