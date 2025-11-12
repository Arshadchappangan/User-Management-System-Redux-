const User = require('../models/user');
const bcrypt = require('bcrypt');
const createToken = require('../utils/createToken');



const userSignup = async (req,res) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).send('Please Fill all Fields')
    }

    let existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).send('User Already Existing')
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password,salt);

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
    console.log(req.body)
    const {email,password} = req.body;

    let user = await User.findOne({email});

    if (user && (await bcrypt.compare(password,user.password))) {
        createToken(res, user._id)
        return res.status(200).json({
            _id : user._id, 
            name : user.name, 
            email : user.email,
            role : user.role
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


const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const uploadProfile = async (req, res) => {
  try {

    const userId = req.user._id
    const user = await User.findByIdAndUpdate(
      userId,
      {profileImage: req.file.filename },
      {new: true}
    )

    if(!user) {
      return res.status(404).json({message: 'User not found'})
    }
    
    res.status(201).json({success: true, message: 'Image uploaded', profileImage: user.profileImage})
    
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Server error'})
  }
}


module.exports = {
    userSignup,
    userLogin,
    userLogout,
    getUserProfile,
    uploadProfile
}