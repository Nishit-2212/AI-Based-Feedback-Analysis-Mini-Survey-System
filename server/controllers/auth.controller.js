const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Company = require('../models/company.js');

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);



const userLogin = async(req,res) => {

    try {
        const result = await User.login(req.body);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 Day
        });

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, //1 Day
        });

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }
}


const companyLogin = async(req, res) => {

    try {
        const result = await Company.login(req.body);
        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }

}


const userSignup = async (req, res) => {

    try {
        const result = await User.signUp(req.body);
        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }

}


const companySignup = async (req, res) => {
    try {
        const result = await Company.signUp(req.body);
        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }
}



const googleLogin = async (req, res) => {
    try {
        const { code } = req.body;

        const { tokens } = await oAuth2Client.getToken(code);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const userData = {
            userName: payload.name,
            email: payload.email,
            provider: 'google'
        };

        console.log("Google user data:", userData);


        const result = await User.googleLogin(userData);

        // 5. Create a local JWT Token
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 Day
        });

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, //1 Day
        });

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    } catch (error) {
        console.error("Google verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }
}


module.exports = { userSignup, googleLogin, companySignup, userLogin, companyLogin };


