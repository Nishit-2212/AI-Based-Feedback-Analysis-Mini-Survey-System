const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js');
const { v4: uuidv4 } = require('uuid');

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



const Transaction = mongoose.model("transaction", transactionSchema);


Transaction.startSurveyTransaction = async (Survey, surveyId, userId, Question) => {
    try {
        const transactionId = uuidv4();

        const newTransaction = new Transaction({
            transactionId: transactionId,
            surveyId: surveyId,
            userId: userId,
            answers: []
        });

        await newTransaction.save();
        const survey = await commanDb.findByIdDB(Survey, surveyId);

        if (!survey) return {
            statusCode: 404,
            success: false,
            message: "Survey not found"
        };

        let allQuestions = [];

        if (survey.aiGeneratedQuestions && survey.aiGeneratedQuestions.length > 0) {
            const aiQuestions = await commanDb.findDB(Question, { questionKey: { $in: survey.aiGeneratedQuestions } });
            allQuestions.push(...aiQuestions);
        }

        if (survey.questions && survey.questions.length > 0) {
            const standardQuestions = await commanDb.findDB(Question, { questionKey: { $in: survey.questions } });
            allQuestions.push(...standardQuestions);
        }

        // TODO: randomize all the questions key.

        return {
            statusCode: 201, return: true,
            success: true,
            message: "Transaction generated successfully.",
            data: {
                transactionId: transactionId,
                questions: allQuestions,
                surveyName: survey.surveyName
            }
        };
    } catch (err) {
        console.error("Error generating survey Transaction:", err);
        return {
            statusCode: 500,
            success: false,
            message: "Server Error starting survey",
            error: { details: err }
        };
    }
}

Transaction.submitResponse = async (transactionId, data) => {
    try {
        console.log('inner submitResponse');
        const getTransactionData = await commanDb.findDB(Transaction, { transactionId: transactionId });

        if (!getTransactionData || getTransactionData.length === 0) {
            return {
                statusCode: 404,
                success: false,
                message: 'Incorrect transactionId',
                error: {
                    details: 'Transaction id not found in the database'
                }
            }
        }

        await commanDb.findOneAndUpdateDB(Transaction, { transactionId: transactionId }, { $set: { answers: data } }, { new: true });

        return {
            statusCode: 200,
            success: true,
            message: 'Your response is sent.',
            data: transactionId
        };
    }
    catch (err) {
        console.log('Error in submit the response');
        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong while submit the Response',
            error: {
                details: err
            }
        };
    }
}

module.exports = Transaction;