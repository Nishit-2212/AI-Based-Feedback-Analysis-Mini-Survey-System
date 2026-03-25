const express = require("express");

const authController = require('../controllers/auth.controller.js')

const route = express.Router();


// route.post('/user/login');

route.post('/user/sign-up',authController.userSignup);

// route.post('/company/login');

// route.post('/company/sign-up');

// route.get('/logout');

// route.get('/me');


module.exports = route;