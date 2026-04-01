const mongoose = require('mongoose');
const commanDb = require('../comman/commandb')

const surveySchema = new mongoose.Schema({
    surveyId: {
        type: Number
    },
    surveyName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    textAnalyzer: {
        type: Boolean,
        default: false
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question'
        }
    ],
    aiGeneratedQuestions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question'
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    surveyLink: {
        type: String
    }
}, { timestamps: true })



const Survey = mongoose.model("survey", surveySchema);


Survey.createSurvey = async (data, companyId, Question) => {
    return await commanDb.createSurvey(Survey, Question, data, companyId)
}

Survey.getPendingCompanySurvey = async (companyId, userId) => {
    return await commanDb.getPendingCompanySurvey(Survey, companyId, userId)
}

Survey.getSurveyIntro = async (surveyId) => {
    return await commanDb.getSurveyIntro(Survey, surveyId)
}

Survey.getAllCompanySurveys = async (companyId) => {
    return await commanDb.getAllCompanySurveys(Survey, companyId);
}

Survey.getCompanySurveyById = async (companyId, surveyId) => {
    return await commanDb.getCompanySurveyById(Survey, companyId, surveyId)
}

// for middleware
Survey.checkCompanySurveyExist = async(companyId, surveyId) => {
    return await commanDb.checkCompanySurveyExist(Survey, companyId, surveyId)
}


Survey.deleteCompanySurveyById = async(surveyId) => {
    return await commanDb.deleteCompanySurveyById(Survey,surveyId);
}


module.exports = Survey;