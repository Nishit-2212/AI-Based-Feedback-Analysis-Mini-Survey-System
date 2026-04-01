const express = require("express");
const companyController = require('../controllers/company.controller.js')
const { isCompany, isSurveyOwner } = require('../middleware/company.middleware.js')
const { isAuth } = require('../middleware/auth.middleware.js')



const route = express.Router();


route.post('/surveys', isAuth, isCompany, companyController.surveyCreate);

route.get('/surveys', isAuth, isCompany, companyController.getAllCompanySurvey);

route.get('/surveys/:surveyId', isAuth, isCompany, isSurveyOwner, companyController.getCompanySurveyById);

// route.put('/surveys/:surveyId', isAuth, isCompany, isSurveyOwner, compan);

route.delete('/surveys/:surveyId', isAuth, isCompany, isSurveyOwner, companyController.deleteSurveyById);

route.patch('/surveys/:surveyId/status', isAuth, isCompany, isSurveyOwner, companyController.toggleSurveyStatus);

route.get('/questions', isAuth, isCompany, companyController.getAllCompanyQuestions);


module.exports = route;