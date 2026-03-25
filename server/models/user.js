const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js')

const userSchema = new mongoose.Schema({
    userId: {
        type:Number,
        required:true
    },
    username: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    role: {
        type:String,
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    higherQualification: {
        type: String,
        required: true
    }
}, { timestamps: true})



const User = mongoose.model("User",userSchema);


User.signUp = async(data) => {
    return await commanDb.signUp(User,data);
}



module.exports = User;