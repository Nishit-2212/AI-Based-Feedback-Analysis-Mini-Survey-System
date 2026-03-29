const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Fetch all registered companies globally
router.get('/companies', userController.getAllCompanies);

// Fetch all generated surveys for a specific company
router.get('/company/:companyId/surveys', userController.getCompanySurveys);

module.exports = router;
