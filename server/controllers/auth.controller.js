const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Company = require('../models/company.js');
const { generateAccessToken } = require('../utils/tokenUtil.js')

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);



const userLogin = async (req, res) => {

    try {
        const result = await User.login(req.body);

        if (result.success) {
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
        }

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


const companyLogin = async (req, res) => {

    try {
        const result = await Company.login(req.body);

        if (result.success) {
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
        }

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

        if (result.success) {
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
        }

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



const generateNewAccessToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken || null;
    console.log("Inner generateTokenFromRefreshToken");

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh Token is not found"
        });
    }

    try {

        const user = await getUserFromRefreshToken(refreshToken);

        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }

        console.log(user);

        let newAccessToken = null
        if (user?.companyName != null) {
            newAccessToken = generateAccessToken(user, company);
        }
        else {
            newAccessToken = generateAccessToken(user, User);
        }

        console.log("New Access Token", newAccessToken);

        if (newAccessToken) {
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 1 * 24 * 60 * 60 * 1000, //1 Day
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "user not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: 'new Access Token is generated',
            data: null,
            error: null
        })

    }
    catch (err) {
        console.log('Error in generating new Token', err);
        return res.status(400).json({
            success: true,
            message: 'new Access Token is generated',
            data: null,
            error: null
        })
    }
}



const logOut = async (req, res) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/"
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/"
    });

    res.status(200).json({
        message: "Logout SuccessFully",
    })
}


const getUserFromRefreshToken = async (refreshToken) => {

    const secretKey = process.env.REFRESH_TOKEN_SECRET;

    try {
        const decryptToken = jwt.verify(refreshToken, secretKey);
        console.log("User Id from refresh token", decryptToken.id);
        console.log('Logged in Role from token', decryptToken.role);

        let getUser = null;

        if (decryptToken.role === 'company') {
            getUser = await Company.getCompanyById(decryptToken.id);
        }
        else {
            getUser = await User.getUserById(decryptToken.id);
        }

        if (!getUser) {
            console.log("User not Found");
            return null;
        }
        return getUser;
    } catch (Err) {
        if (Err && Err.name === "TokenExpiredError") {
            return null;
        }
        console.log("Error in geting data from refreshToken", Err);
        return null;
    }
}




module.exports = { userSignup, googleLogin, companySignup, userLogin, companyLogin, generateNewAccessToken, logOut };


