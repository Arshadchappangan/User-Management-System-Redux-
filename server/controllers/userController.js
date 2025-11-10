const User = require('../models/user');
const bcrypt = require('bcrypt');
const createToken = require('../utils/createToken');
const { use } = require('react');



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

    createToken(res,newUser._id);
    return res.status(201).json({
        _id : newUser._id,
        name : newUser.name,
        email : newUser.email
    })
}

const userLogin = async (req,res) => {
    const {email,password} = req.body;

    let user = await User.findOne({email});

    if (user && (await bcrypt.compare(password,user.password))) {
        createToken(res, user._id)
        return res.status(200).json({
            _id : user._id, 
            name : user.name, 
            email : user.email
        })
    }
    
    return res.status(400).send('Invalid Credentials');
}


const userLogout = async (req,res) => {
    res.cookie('jwt','',{
        httpOnly : true,
        expires : new Date(0)
    })

    return res.status(200).json({message : 'Logged out successfully'})
}


const getUserProfile = async (req,res) => {
    const user = await User.findOne({_id:req._id});
    if(user) {
        return res.json({
            _id : user._id,
            name : user.name,
            email : user.email
        })
    }
    return res.status(404).send('User Not Found');
}


module.exports = {
    userSignup,
    userLogin,
    userLogout,
    getUserProfile
}