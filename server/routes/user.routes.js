const express = require('express');
const userController = require('../controllers/user.controller');
const { isAuth } = require('../middleware/isAuth.middleware')

const router = express.Router();

router.get('/companies', isAuth, userController.getAllCompanies);

router.get('/company/:companyId/surveys', isAuth, userController.getCompanySurveys);

module.exports = router;
