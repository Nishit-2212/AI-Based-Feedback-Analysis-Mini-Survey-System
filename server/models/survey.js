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
    questions: [
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


Survey.createSurvey = async(data,Question) => {
    return await commanDb.createSurvey(Survey,Question,data)
}



module.exports = Survey;