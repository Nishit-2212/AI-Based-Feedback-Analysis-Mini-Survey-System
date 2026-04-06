
const Question = require('../models/question');
const Survey = require('../models/survey')


const surveyCreate = async (req, res) => {
    try {
        console.log('inner survey Controller');
        const result = await Survey.createSurvey(req.body.survey, req.user.id, Question);

        console.log('req.protocol', req.protocol);
        console.log('req.get("host")', req.get("host"));
        console.log('url', process.env.CLIENT_URL);


        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }
}


const getAllCompanySurvey = async (req, res) => {

    try {
        const companyId = req.user.id;
        const result = await Survey.getAllCompanySurveys(companyId);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }

}


const getCompanySurveyById = async (req, res) => {

    try {
        const companyId = req.user.id;
        const { surveyId } = req.params;

        console.log('SurveyId', surveyId)
        const result = await Survey.getCompanySurveyById(companyId, surveyId);

        console.log('result', result)

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }

}


const deleteSurveyById = async (req, res) => {

    try {
        // const companyId = req.user.id;
        const { surveyId } = req.params;

        console.log('SurveyId', surveyId)
        const result = await Survey.deleteCompanySurveyById(surveyId);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }

}


const toggleSurveyStatus = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const result = await Survey.toggleSurveyStatus(surveyId);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }
}


const getAllCompanyQuestions = async (req, res) => {
    try {
        const companyId = req.user.id;
        const result = await Question.getQuestionsByCompanyId(companyId);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        });
    }
}


const getAllCommanQuestions = async (req, res) => {
    try {

        const result = await Question.getAllCommanQuestions();

        console.log("Result in controller",result);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: { details: err }
        });
    }

}


module.exports = { surveyCreate, getAllCompanySurvey, getCompanySurveyById, deleteSurveyById, toggleSurveyStatus, getAllCompanyQuestions, getAllCommanQuestions };