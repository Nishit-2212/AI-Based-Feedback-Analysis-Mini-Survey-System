const Company = require('../models/company');
const Survey = require('../models/survey');
const commanDb = require('../comman/commandb');

const getAllCompanies = async (req, res) => {
    try {
        console.log("Fetching all companies...");

        const result = await Company.getAllCompanies();

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ success: false, message: "Internal server error connecting to DB" });
    }
};

const getPendingCompanySurvey = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { id } = req.user;
        console.log(`Company Id isa ${companyId}`);

        const company = await Company.getCompanyById(companyId);
        
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const surveys = await Survey.getPendingCompanySurvey(companyId, id);

        return res.status(surveys.statusCode).json({
            success: surveys.success,
            message: surveys.message,
            data: surveys.data || null,
            error: surveys.error || null
        });
    } catch (error) {
        console.error("Error fetching company surveys:", error);
        res.status(500).json({ success: false, message: "Internal server error connecting to DB" });
    }
};

const getSurveyIntroDetails = async (req, res) => {
    try {
        const { surveyId } = req.params;
        console.log(`Survey Id is :- ${surveyId}`);

        const result = await Survey.getSurveyIntro(surveyId);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });
    } catch (error) {
        console.error("Error fetching survey intro:", error);
        res.status(500).json({ success: false, message: "Internal server error connecting to DB" });
    }
};

const Transaction = require('../models/transaction');
const Question = require('../models/question');

const startSurvey = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const userId = req.user.id;

        console.log(`Survey Id  ${surveyId} and User id ${userId}`);

        const result = await Transaction.startSurveyTransaction(Survey, surveyId, userId, Question);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });
    } catch (error) {
        console.error("Error initializing survey transaction:", error);
        res.status(500).json({ success: false, message: "Internal server error connecting to DB" });
    }
};

module.exports = { getAllCompanies, getPendingCompanySurvey, getSurveyIntroDetails, startSurvey }
