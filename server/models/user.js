const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js')

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,

    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    higherQualification: {
        type: String,
    }
}, { timestamps: true })



const User = mongoose.model("User", userSchema);


User.signUp = async (data) => {
    return await commanDb.signUp(User, data);
}

User.googleLogin = async (data) => {
    return await commanDb.googleLogin(User, data);
}

User.login = async (data) => {
    return await commanDb.login(User, data);
}

User.getUserById = async(id) => {
    return await commanDb.getUserById(User,id)
}

module.exports = User;