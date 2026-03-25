const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({

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
    options: [String],
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'survey'
    },

}, { timestamps: true })


module.exports = mongoose.model("question", questionsSchema);