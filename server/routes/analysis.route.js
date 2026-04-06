const express = require('express');

const { isCompany, isSurveyOwner } = require('../middleware/company.middleware')
const { isAuth } = require('../middleware/auth.middleware')
const transactionController = require('../controllers/transaction.controller')


const router = express.Router();



router.get('/responses', isAuth, isCompany, transactionController.totalTransaction);

router.get('/response/:surveyId', isAuth, isCompany, isSurveyOwner, transactionController.getAllResponseBySurveyId)



module.exports = router;