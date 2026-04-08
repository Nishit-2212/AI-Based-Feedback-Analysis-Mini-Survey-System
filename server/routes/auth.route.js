const express = require("express");

const authController = require('../controllers/auth.controller.js')

const route = express.Router();


route.post('/user/login',authController.userLogin);

route.post('/user/sign-up',authController.userSignup);

route.post('/google',authController.googleLogin);

route.post('/company/login',authController.companyLogin);

route.post('/company/sign-up',authController.companySignup);

route.post('/generateToken', authController.generateNewAccessToken);

route.post('/logout', authController.logOut);

// route.get('/me', authController.getUserInfo);


module.exports = route;