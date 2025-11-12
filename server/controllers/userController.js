const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send('Please Fill all Fields')
    }

    let existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).send('User Already Existing')
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({success: false, message: 'Server error'})
  }
}

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email, !password) {
      res.status(404).json({ success: false, message: "All fields required" });
      return
    }

    let user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not Found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Wrong password" });
      return;
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )  

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }

}


const userLogout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  return res.status(200).json({ message: 'Logged out successfully' })
}


const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    res.status(200).send({ user });
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
      { profileImage: req.file.filename },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(201).json({ success: true, message: 'Image uploaded', profileImage: user.profileImage })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}


module.exports = {
  userSignup,
  userLogin,
  userLogout,
  getUserProfile,
  uploadProfile
}