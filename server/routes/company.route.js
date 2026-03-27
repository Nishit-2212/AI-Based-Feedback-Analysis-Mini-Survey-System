const express = require("express");
const compnayController = require('../controllers/company.controller.js')

const route = express.Router();


// route.get('/surveys');

route.post('/surveys', compnayController.surveyCreate);

// route.put('/surveys/:id');

// route.delete('/surveys/:id');

// route.patch('/surveys/:id/status');



module.exports = route;