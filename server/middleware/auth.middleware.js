const jwt = require("jsonwebtoken");
require('dotenv').config();


const isAuth = (req, res, next) => {

    console.log('inner isAuth middleware');

    console.log('req.cookie', req.cookies);


    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log('This is my access token', accessToken);
    console.log('This is my refresh token', refreshToken);

    if (!refreshToken) {
        console.log("Refresh token not found");
        return res.status(404).json({
            success: false,
            code: 'INVALID',
            message: "Refresh Token is not found",
            error: {
                details: "pleas re-login"
            }

        });
    }

    if (!accessToken) {
        console.log("Token not found in verifyToken middleware");
        return res.status(401).json({
            success: false,
            message: "Access Token is not found",

            error: {
                details: "pleas re-login"
            }
        });
    }

    let secretKey = process.env.ACCESS_TOKEN_SECRET;
    console.log('secretKey', secretKey)
    console.log("Inner verify Token middleware");

    try {
        const getData = jwt.verify(accessToken, secretKey);
        console.log('getData', getData);
        req.user = getData;
        next();
    }
    catch (err) {
        console.error('inAuth error', err)
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Token Expired",
                success: false,

            });
        }
        return res.status(400).json({
            success: false,
            message: "Access Token is not found",
            error: {
                details: "Token Invalid or censored so please re-login"
            }
        }
        );
    }

}


const isAdmin = (req, res, next) => {

    try {
        const role = req.user.role;
        console.log("role", role);

        if (role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: "Sorry you can't access it",
                error: {
                    details: "pleas re-login with admin Email"
                }
            });
        }
        next();
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong durin ",
            error: {
                details: "Something goes wrong in CompanyMiddleware(isCompany method)"
            }
        });
    }

}


module.exports = { isAuth, isAdmin }