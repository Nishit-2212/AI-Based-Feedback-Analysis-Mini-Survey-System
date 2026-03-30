const express = require("express");
const compnayController = require('../controllers/company.controller.js')
const { isCompany } = require('../middleware/isCompany.middleware.js')
const { isAuth } = require('../middleware/isAuth.middleware')



const route = express.Router();


// route.get('/surveys');

route.post('/surveys', isAuth, isCompany, compnayController.surveyCreate);

// route.put('/surveys/:id');

// route.delete('/surveys/:id');

// route.patch('/surveys/:id/status');



module.exports = route;