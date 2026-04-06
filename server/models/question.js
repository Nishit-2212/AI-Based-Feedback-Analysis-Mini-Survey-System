const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js');
const { v4: uuidv4 } = require('uuid');

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
        console.log('questions', questions)

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


Question.createQuestion = async (companyId, question) => {

    try {
        console.log(question);
        const questionDynamicKey = `dynamic_key_${companyId}_${uuidv4()}`;

        if (question.type === 'TEXT') {
            const newQuestion = new Question({
                questionKey: questionDynamicKey,
                questionText: question.text,
                questionType: question.type,
                companyId: companyId,
                isAiGenerated: false
            });

            await newQuestion.save();
        } else {
            const options = [];
            for (const option of question.options) {
                options.push(option);
            }

            const newQuestion = new Question({
                questionKey: questionDynamicKey,
                questionText: question.text,
                questionType: question.type,
                companyId: companyId,
                isAiGenerated: false,
                options: options
            });

            await newQuestion.save();
        }

        return {
            statusCode: 201,
            success: true,
            message: "Qustions created succesfully",
            data: questionDynamicKey
        };
    }
    catch (err) {
        console.error("Erron in creating question");
        return {
            statusCode: 500,
            success: false,
            message: "questions created unsuccesful",
            error: {
                details: err
            }
        };
    }
}


Question.getAllCommanQuestions = async () => {

    try {
        // :TODO change this static companyId
        // in company Id i will be passing adminCompany id which innovateMR@gmail.com 's ID.
        const result = await commanDb.findDB(Question, { companyId: '69ce19ceb56451eec39277d0' }) 

        console.log('Result',result)

        return {
            statusCode: 200,
            success: true,
            message: "Qustions fecthed succesfully",
            data: result
        };

    }
    catch (err) {
        console.error('error while fetching all questions', err);

        return {
            statusCode: 500,
            success: false,
            message: "Questions fetched unsuccesful",
            error: {
                details: err
            }
        }
    }

}





module.exports = Question;