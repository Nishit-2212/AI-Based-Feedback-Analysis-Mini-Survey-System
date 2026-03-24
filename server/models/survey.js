const mongoose = require('mongoose');


const question = new mongoose.Schema({
    questionKey: {
        type: mongoose.Schema.Types.ObjectId
    },
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['text', 'mcq', 'multiple'],
        required: true
    },
    options: [String]
})


const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    questions: [question],
    isActive: {
        type: Boolean,
        default: true
    },
    surveyLink: {
        type: String
    }
}, { timestamps: true})

module.exports = mongoose.model("survey",surveySchema);