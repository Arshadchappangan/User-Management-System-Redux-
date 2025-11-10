const User = require('../models/user');
const bcrypt = require('bcrypt');


const userSignup = async (req,res) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).send('Please Fill all Fields')
    }

    let existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).send('User Already Existing')
    }

    let salt = bcrypt.genSalt(10);
    let hashedPassword = bcrypt.hash(password,salt);

    const newUser = new User({
        name,
        email,
        password : hashedPassword
    })

    await newUser.save();
}