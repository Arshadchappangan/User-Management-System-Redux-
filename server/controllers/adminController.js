const User = require("../models/user");
const bcrypt = require('bcrypt')


const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const users = await User.find({ role: 'user' }).skip(skip).limit(limit).lean();
        const total = await User.countDocuments({ role: 'user' });

        res.send({
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const createUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(404).json({ success: true, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ success: false, message: 'User already exists' });
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
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

const updateUser = async (req, res) => {
    try {
        let userId = req.params.id;
        let { name, email } = req.body;

        name = name.trim();
        email = email.trim();

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exist' })
        }

        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.send({ message: "User updated" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' })
    }
}

const deleteUser = async (req, res) => {
    try {
        let userId = req.params.id;

        await User.findByIdAndDelete(userId);
        res.send({ message: 'User Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' })
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}