const jwt = require("jsonwebtoken");
// const Company = require("../models/company");
// const User = require("../models/user");
require('dotenv').config();


const generateAccessToken = (userData, role) => {
    console.log('role',userData.role)
    return jwt.sign(
        {
            id: userData._id,
            role: userData.role,
            userName: userData.userName || userData.companyName
        },
        process.env.ACCESS_TOKEN_SECRET || "jnjnmjnmbVF345",
        { expiresIn: "1d" }
    );
};

const generateRefreshToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role
        },
        process.env.REFRESH_TOKEN_SECRET || "jmhmyibyvDdfgdSD34dDF",
        { expiresIn: "7d" }
    );
};





module.exports = { generateAccessToken, generateRefreshToken };
