const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js');
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil');

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
    try {
        const emailExists = await commanDb.getUserByEmail(User, data.email);
        if (emailExists) {
            return {
                statusCode: 400,
                success: false,
                message: "Email already exist please login",
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const nextId = await commanDb.getNextSequence(User.modelName);

        const newUser = new User({
            ...data,
            password: hashedPassword,
            userId: nextId
        });

        await newUser.save();

        return {
            statusCode: 201,
            success: true,
            message: "signUp succesfully",
            data: newUser
        };
    } catch (err) {
        console.error("Error in User signUp:-", err);
        return {
            statusCode: 500,
            success: false,
            message: "SignedUp unsuccesful",
            error: {
                details: err
            }
        };
    }
}

User.googleLogin = async (data) => {
    try {
        const { email, userName, provider } = data;

        let user = await commanDb.findOneDB(User, { email });

        if (!user) {
            const newUser = new User({ email, userName, provider });
            user = await newUser.save(); 
        }

        const token = generateAccessToken(user, User.modelName);
        const RefreshToken = generateRefreshToken(user._id, User.modelName); 

        return {
            statusCode: 200,
            success: true,
            data: { userName: user.userName, role: user.role },
            refreshToken: RefreshToken,
            accessToken: token,
            message: "Login sucessful",
        }
    } catch (err) {
        console.log("Something goes wrong while login", err);
        return { 
            statusCode: 500, 
            success: false, 
            message: "Login unsuccesful", 
            error: { details: err } 
        };
    }
}

User.login = async (data) => {
    try {
        const getUserData = await commanDb.getUserByEmail(User, data.email);

        console.log("getUserData", getUserData);

        if (!getUserData) {
            return {
                statusCode: 404,
                success: false,
                message: "Email is not found"
            };
        }

        let { password } = data;
        let storedPassword = getUserData.password;
        console.log("pass,store", password, storedPassword);
        const passwordMatched = await bcrypt.compare(password, storedPassword);

        if (!passwordMatched) {
            return {
                statusCode: 401,
                success: false,
                message: "password is incorrect"
            };
        }

        const token = generateAccessToken(getUserData, User.modelName);
        const RefreshToken = generateRefreshToken(getUserData._id, User.modelName);

        return {
            statusCode: 200,
            success: true,
            message: "Login sucessful",
            data: {
                userName: getUserData.userName,
                role: getUserData.role
            },
            refreshToken: RefreshToken,
            accessToken: token
        }
    }
    catch (err) {
        console.log("Something goes wrong while login", err);
        return {
            statusCode: 500,
            success: false,
            message: "Login unsuccesful",
            error: {
                details: err
            }
        };
    }
}

User.getUserById = async(id) => {
    try {
        const user = await commanDb.findByIdDB(User, id, { password: 0, createdAt: 0, updatedAt: 0 });
        return { 
            statusCode: 200, 
            success: true, 
            message: "User fetched succesfully", 
            data: user 
        };
    } catch (err) {
        console.error("Error in fetching User:-", err);
        return { 
            statusCode: 500, 
            success: false, 
            message: "User fetched unsuccesful", 
            error: { details: err } 
        };
    }
}

module.exports = User;