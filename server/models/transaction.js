const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js')

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


Transaction.submitResponse = async (td,data) => {
    console.log('inner transaction Model')
    return await commanDb.submitResponse(td,data,Transaction);
}

module.exports = Transaction;