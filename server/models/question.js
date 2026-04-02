const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js');

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
        // ::TODO modify this pipeline and fetch all question accept comman question
        const pipeline = [
            {
                $match: {
                    $and: [
                        { companyId: new mongoose.Types.ObjectId(companyId) },
                        { isAiGenerated: false },
                    ],
                }
            }
        ];

        const questions = await commanDb.aggregateDB(Question, pipeline);
        console.log('questions',questions)

        return {
            statusCode: 200,
            success: true,
            message: "Past questions fetched successfully",
            data: questions
        };

    }
    catch (error) {
        console.error("Error fetching company questions:", error);

        return {
            statusCode: 500,
            success: false,
            message: "Failed to fetch past questions",
            error: {
                details: error
            }
        };
    }
}

module.exports = Question;