const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({

    questionKey: {
        type: String,
        required: true,
        unique: true,
        index: true
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
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    isAiGenerated: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


const Question = mongoose.model("question", questionsSchema);

Question.getQuestionsByCompanyId = async (companyId) => {
    try {
        const commanDb = require('../comman/commandb.js');
        const pipeline = [
            { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
            { $sort: { createdAt: -1 } },
            { 
                $group: { 
                    _id: "$questionText", 
                    doc: { $first: "$$ROOT" } 
                } 
            },
            { $replaceRoot: { newRoot: "$doc" } },
            { $sort: { createdAt: -1 } },
            { $limit: 150 }
        ];

        const questions = await commanDb.aggregateDB(Question, pipeline);
        return { statusCode: 200, success: true, message: "Past questions fetched successfully", data: questions };
    } catch (error) {
        console.error("Error fetching company questions:", error);
        return { statusCode: 500, success: false, message: "Failed to fetch past questions", error: { details: error } };
    }
}

module.exports = Question;