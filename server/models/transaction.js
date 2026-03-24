const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionKey: {
        type: mongoose.Schema.Types.ObjectId
    }, 
    answer: [String]
})

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true
    },
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'survey'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    answers: [answerSchema]
}, { timestamps: true })

module.exports = mongoose.model("transaction", transactionSchema);