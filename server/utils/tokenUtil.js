const jwt = require("jsonwebtoken");

const generateAccessToken = (userData, role) => {
    return jwt.sign(
        { 
            id: userData._id, 
            role: role 
        }, 
        process.env.ACCESS_TOKEN_SECRET || "jnjnmjnmbVF345", 
        { expiresIn: "1d" } 
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId }, 
        process.env.REFRESH_TOKEN_SECRET || "jmhmyibyvDdfgdSD34dDF", 
        { expiresIn: "7d" } 
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
