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
}, { timestamps: true})



const Survey = mongoose.model("survey",surveySchema);


Survey.createSurvey = async(data, companyId, Question) => {
    return await commanDb.createSurvey(Survey,Question,data,companyId)
}

Survey.getCompanySurveys = async(companyId, userId) => {
    return await commanDb.getCompanySurveys(Survey, companyId, userId)
}

Survey.getSurveyIntro = async(surveyId) => {
    return await commanDb.getSurveyIntro(Survey, surveyId)
}
 

module.exports = Survey;