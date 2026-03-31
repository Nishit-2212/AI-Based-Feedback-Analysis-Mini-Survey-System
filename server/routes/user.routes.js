const express = require('express');
const userController = require('../controllers/user.controller');
const { isAuth } = require('../middleware/auth.middleware')

const router = express.Router();

router.get('/companies', isAuth, userController.getAllCompanies);

router.get('/company/:companyId/surveys', isAuth, userController.getCompanySurveys);

router.get('/survey/:surveyId/intro', isAuth, userController.getSurveyIntroDetails);

router.post('/survey/:surveyId/start', isAuth, userController.startSurvey);

module.exports = router;
