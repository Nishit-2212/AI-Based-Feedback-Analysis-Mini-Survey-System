const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({

    questionKey: {
        type: Number,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['TEXT', 'MCQ', 'MULTIPLE'],
        required: true
    },
    options: [String],
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'survey'
    },

}, { timestamps: true })


const Question = mongoose.model("question", questionsSchema);




module.exports = Question;