const express = require("express");

const transactionController = require('../controllers/transaction.controller')
const { isAuth } = require('../middleware/auth.middleware')

const route = express.Router();


route.post('/:transactionId/submit', isAuth, transactionController.submitResponse)


module.exports = route;