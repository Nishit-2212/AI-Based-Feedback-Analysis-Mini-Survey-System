const express = require("express");

const adminController = require('../controllers/admin.controller')
const { isAuth, isAdmin } = require('../middleware/auth.middleware')

const route = express.Router();


route.post('/addCommanQuestion', isAuth, isAdmin, adminController.addCommanQustion);

route.get('/getAllUser', isAuth, isAdmin, adminController.getAllUser);

route.get('/getAllCommanQuestion', isAuth, isAdmin, adminController.getAllCommanQuestions);



module.exports = route;