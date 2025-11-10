const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, 'Name is Required'],
            trim : true
        },
        email : {
            type : String,
            required : [true, 'Email is Required'],
            unique : true,
            lowercase : true
        },
        password : {
            type : String,
            required : [true, 'Password is required'],
        },
        profileImage : {
            type : String,
            default : ''
        },
        role : {
            type : String,
            enum : ['user','admin'],
            default : 'user'
        }
    },
    {timestamps : true}
);

module.exports = mongoose.model('User',userSchema);